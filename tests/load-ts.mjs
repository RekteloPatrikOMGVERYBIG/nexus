import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
export function loadTS(file, mocks = {}, cache = new Map()) {
  const path = resolve(file);
  if (cache.has(path)) return cache.get(path);
  const exports = {};
  cache.set(path, exports);
  const source = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(
    source,
    {
      exports,
      Headers,
      URL,
      URLSearchParams,
      AbortSignal,
      fetch,
      process: {
        env: {
          NEXT_PUBLIC_SUPABASE_URL: "https://supabase.test",
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-key",
        },
      },
      require(name) {
        if (name === "server-only") return {};
        if (name in mocks) return mocks[name];
        if (name.startsWith(".") || name.startsWith("@/"))
          return loadTS(
            (name.startsWith("@/")
              ? resolve(name.slice(2))
              : resolve(dirname(path), name)) + ".ts",
            mocks,
            cache,
          );
        return require(name);
      },
    },
    { filename: path },
  );
  return exports;
}
