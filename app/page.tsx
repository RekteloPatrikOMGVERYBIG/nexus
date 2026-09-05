import Link from "next/link";
import HeroInterface from "./components/hero/HeroInterface";
import { Arrow, Brand, ModuleIcon, NexusMark, type ModuleName } from "./components/ui/Brand";
import Reveal from "./components/ui/Reveal";
import WorkspacePreview from "./components/ui/WorkspacePreview";

export default function Home() {
  return <main id="main-content" className="landing">
    <HeroInterface />
    <section className="workspace-section content-width" id="workspace">
      <Reveal><div className="section-heading"><div><p className="eyebrow"><span className="section-number">01 /</span> THE WORKSPACE</p><h2>Less scattered.<br /><span className="muted">More connected.</span></h2></div><p>Your work has many dimensions.<br />Your workspace should bring them together.<br /><span className="small-note">Discover the NEXUS vision.</span></p></div></Reveal>
      <Reveal><WorkspacePreview /></Reveal>
    </section>
    <section className="system-section" id="system"><div className="content-width">
      <Reveal><div className="section-heading"><div><p className="eyebrow"><span className="section-number">02 /</span> SHARED GRAVITY</p><h2>Not just a place.<br /><span className="muted">A connected system.</span></h2></div><p>Ideas become useful when they find context.<br />NEXUS is being built to bring that<br />context closer to everything you do.</p></div></Reveal>
      <Reveal className="system-layout"><div className="connection-map" aria-hidden="true"><div className="map-grid" /><svg className="map-lines" viewBox="0 0 600 400" preserveAspectRatio="none"><path d="M100 90Q300 90 300 200T500 310M500 90Q300 90 300 200T100 310M100 90 500 310M500 90 100 310" /></svg><div className="map-core"><NexusMark /><span>NEXUS</span></div>{(["code", "projects", "people", "ai"] as ModuleName[]).map((id, index) => <div className={`map-node map-node-${index}`} key={id}><ModuleIcon name={id} /><span>{id.toUpperCase()}</span><i /></div>)}<span className="map-caption">SEPARATE PARTS. A SHARED PURPOSE.</span></div><div className="principle-list">{[{ n: "01", title: "Keep the context.", text: "Your code means more when it lives close to the ideas and people behind it." }, { n: "02", title: "Find your focus.", text: "A considered interface that gives your work room to breathe. The essential things, within reach." }, { n: "03", title: "Leave room for possibility.", text: "An evolving space for the connections you haven’t made yet. Built with curiosity at its core." }].map((item) => <article key={item.n}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><Arrow diagonal /></article>)}</div></Reveal>
    </div></section>
    <section className="philosophy-section" id="philosophy"><div className="content-width"><Reveal><div className="philosophy-top"><p className="eyebrow">03 / A DIFFERENT KIND OF WORKSPACE</p><span className="tiny-cross">✳</span></div><h2>Less noise.<br />More <span>possibility.</span></h2><div className="philosophy-bottom"><span className="mono">DESIGNED WITH INTENTION.</span><p>We believe the best tools make space for better thinking. NEXUS brings a little more clarity, a little more connection, and a lot more room for what comes next.</p></div></Reveal></div></section>
    <section className="closing-section content-width"><Reveal><div className="closing-orbit" aria-hidden="true"><NexusMark /></div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Make room for<br />your next big idea<span className="orange-dot">.</span></h2><Link className="button button-primary" href="/nexus">Enter your workspace <Arrow diagonal /></Link><p className="closing-note">NEXUS is evolving. Come explore what’s taking shape.</p></Reveal></section>
    <footer className="site-footer content-width"><Brand /><span>INDEPENDENT IDEAS. SHARED GRAVITY.</span><div><a href="#top">Back to top ↑</a><span>© {new Date().getFullYear()} NEXUS</span></div></footer>
  </main>;
}
