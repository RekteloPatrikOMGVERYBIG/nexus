"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow, ModuleIcon, NexusMark, type ModuleName } from "./Brand";

const modules: { id: ModuleName; title: string; text: string }[] = [
  { id: "code", title: "A home for your best thinking.", text: "The useful snippet. The elegant solution. The idea worth keeping. Give your engineering knowledge a place to belong." },
  { id: "projects", title: "See the work. Find the direction.", text: "A shared perspective on what you’re building, why it matters, and what comes next. Less scattered context. More clarity." },
  { id: "people", title: "Great work has people behind it.", text: "Keep the people, ownership, and conversations close to the work. A connected space for the minds making it happen." },
  { id: "ai", title: "A little more perspective.", text: "Explore a future where your engineering context becomes useful insight. Intelligence built around the way you think." },
];

export default function WorkspacePreview() {
  const [selected, setSelected] = useState<ModuleName>("code");
  const active = modules.find((item) => item.id === selected)!;
  return <div className="workspace-showcase">
    <div className="showcase-nav" aria-label="Explore the modules">{modules.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === item.id} className={selected === item.id ? "selected" : ""} onClick={() => setSelected(item.id)}><ModuleIcon name={item.id} /><span>{item.id === "ai" ? "Intelligence" : item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span><small>0{index + 1}</small></button>)}</div>
    <div className="showcase-body" key={selected}>
      <div className="showcase-copy"><span className="eyebrow">{selected.toUpperCase()} / IN DEVELOPMENT</span><h3>{active.title}</h3><p>{active.text}</p><Link className="text-link" href="/nexus">Explore NEXUS <Arrow /></Link></div>
      <div className="preview-window"><div className="window-bar"><span className="window-dots"><i /><i /><i /></span><span>nexus / {selected}</span><span className="preview-label">CONCEPT PREVIEW</span></div>
        {selected === "code" ? <div className="code-preview"><div className="file-tab"><ModuleIcon name="code" /> connected.ts <span>TS</span></div><pre><code><span className="code-comment">{"// Good ideas belong together."}</span>{"\n\n"}<span className="code-purple">const</span>{" workspace = {\n"}{"  code: "}<span className="code-orange">{'"a place to think"'}</span>{",\n"}{"  projects: "}<span className="code-orange">{'"a direction to build"'}</span>{",\n"}{"  people: "}<span className="code-orange">{'"a reason to connect"'}</span>{",\n"}{"  possibilities: "}<span className="code-purple">Infinity</span>{",\n};\n\n"}<span className="code-comment">{"// Make something that matters."}</span>{"\n"}<span className="code-purple">export default</span>{" workspace;"}</code></pre><div className="code-footer"><span className="signal-dot" /> An idea, in its element.</div></div> : <div className={`concept-art concept-${selected}`}><div className="concept-center"><NexusMark /></div>{[0, 1, 2, 3].map((i) => <div className={`concept-node concept-node-${i}`} key={i}><ModuleIcon name={modules[i].id} /></div>)}<div className="concept-orbit" /><div className="concept-orbit orbit-inner" /><span className="concept-caption">{selected === "projects" ? "EVERY STEP, CONNECTED" : selected === "people" ? "BETTER, TOGETHER" : "CONTEXT BECOMES POSSIBILITY"}</span></div>}
      </div>
    </div>
  </div>;
}
