import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { createServer } from "node:net";

async function availablePort() {
  const probe = createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const { port } = probe.address();
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()));
  return String(port);
}
const port = process.env.SMOKE_PORT || await availablePort();
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});
let logs = "";
server.stdout.on("data", chunk => { logs = (logs + chunk).slice(-6000); });
server.stderr.on("data", chunk => { logs = (logs + chunk).slice(-6000); });
const exited = once(server, "exit");

try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (server.exitCode !== null) throw new Error("Preview server exited before readiness.");
    // Do not accidentally test an unrelated process already using this port.
    if (logs.includes("Ready in")) { ready = true; break; }
    await delay(200);
  }
  assert.ok(ready, "Production server did not become ready.");
  for (const [path, status, destination] of [
    ["/", 200], ["/login", 307, "/nexus/login"],
    ["/nexus/login", 200], ["/nexus", 307, "/nexus/login"],
    ["/nexus/private?view=recent", 307, "/nexus/login"],
    ["/nexus/signup", 200], ["/nexus/forgot-password", 200],
    ["/nexus/reset-password", 200], ["/api/auth/session", 401],
  ]) {
    const response = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, status, path);
    if (destination) {
      const target = new URL(response.headers.get("location"), base);
      assert.equal(target.pathname, destination, path);
      assert.equal((await fetch(target, { redirect: "manual", signal: AbortSignal.timeout(10000) })).status, 200, "Redirect must terminate at the public login page.");
      if (path.includes("view=recent")) assert.equal(target.searchParams.get("next"), "/nexus/private?view=recent");
    }
    const html = await response.text();
    if (path === "/") assert.match(html, /data-scroll-behavior="smooth"/);
    if (path === "/nexus/reset-password") assert.match(html, /Request a fresh link/);
    console.log(`PASS ${path}: ${status}`);
  }
  const response = await fetch(base + "/api/auth/logout", {
    method: "POST", headers: { origin: "https://untrusted.invalid", "content-type": "application/json" }, body: "{}", signal: AbortSignal.timeout(10000),
  });
  assert.equal(response.status, 403);
  console.log("PASS cross-origin logout rejected");
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  server.kill();
  await exited;
}
