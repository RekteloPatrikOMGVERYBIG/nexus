import NexusScene from "./components/experience/NexusScene";
import HeroInterface from "./components/hero/HeroInterface";

export default function Home() {
  return (
    <main className="nexus-page">
      <NexusScene />
      <HeroInterface />

      <section
        className="nexus-intelligence"
        aria-label="Nexus Intelligence"
      >
        <span className="section-index">
          02 / 06
        </span>

        <div className="intelligence-network" aria-hidden="true">
          <svg viewBox="0 0 520 520">
            <circle
              className="network-orbit"
              cx="260"
              cy="260"
              r="180"
            />

            <circle
              className="network-orbit network-orbit-alt"
              cx="260"
              cy="260"
              r="135"
            />

            <line className="network-line" x1="250" y1="90" x2="120" y2="250" />
            <line className="network-line" x1="120" y1="250" x2="220" y2="390" />
            <line className="network-line" x1="220" y1="390" x2="400" y2="360" />
            <line className="network-line" x1="400" y1="360" x2="410" y2="180" />
            <line className="network-line" x1="410" y1="180" x2="250" y2="90" />
            <line className="network-line" x1="120" y1="250" x2="410" y2="180" />
            <line className="network-line" x1="250" y1="90" x2="220" y2="390" />

            <circle className="network-node" cx="250" cy="90" r="4" />
            <circle className="network-node" cx="120" cy="250" r="4" />
            <circle className="network-node" cx="220" cy="390" r="4" />
            <circle className="network-node" cx="400" cy="360" r="4" />
            <circle className="network-node" cx="410" cy="180" r="4" />
          </svg>
        </div>
        
        <div className="section-copy">
          <p>ENGINEERING INTELLIGENCE</p>

          <h2>
            UNDERSTAND
            <br />
            THE SYSTEM.
          </h2>

          <p>
            NEXUS connects code, projects,
            people and AI into one intelligent
            engineering system.
          </p>
        </div>
      </section>

      <section
        className="nexus-connections"
        aria-label="Nexus Connection"
      >
        <span className="section-index">
          03 / 06
        </span>

        <div className="connections-header">
          <p>CONNECTED INTELLIGENCE</p>

          <h2>
            SEE THE
            <br />
            CONNECTION
          </h2>
        </div>

        <div 
          className="connections-system"
          aria-hidden="true"
        >
          <div className="system-ring ring-one" />
          <div className="system-ring ring-two" />

          <svg
            className="connections-lines"
            viewBox="0 0 800 600"
          >
            <line x1="400" y1="95" x2="640" y2="300" />
            <line x1="640" y1="300" x2="400" y2="505" />
            <line x1="400" y1="505" x2="160" y2="300" />
            <line x1="160" y1="300" x2="400" y2="95" />
            
            <line x1="400" y1="95" x2="400" y2="505" />
            <line x1="160" y1="300" x2="640" y2="300" />
          </svg>

          <div className="system-node node-code">
            <span>01</span>
            <strong>CODE</strong>
          </div>

          <div className="system-node node-projects">
            <span>02</span>
            <strong>PROJECTS</strong>
          </div>

          <div className="system-node node-people">
            <span>03</span>
            <strong>PEOPLE</strong>
          </div>

          <div className="system-node node-ai">
            <span>04</span>
            <strong>AI</strong>
          </div>
        </div>

        <p className="connections-copy">
          NEXUS maps the relationships between
          engineering knowledge, execution and
          intelligence - turning disconnected
          information into one working system.
        </p>

      </section>

      <section
        className="nexus-connection"
        aria-label="Nexus Connection"
      >
        <span className="section-index">
          04 / 06
        </span>

        <div className="connection-copy">
          <p>INTELLIGENT CONNECTION</p>

          <h2>
            CONNECT
            <br />
            EVERYTHING.
          </h2>

          <p>
            NEXUS turns isolated knowledge,
            systems and people into a connected
            engineering environment.
          </p>
        </div>

        <div
          className="connection-network"
          aria-hidden="true"
        >
          <svg viewBox="0 0 520 520">
            <circle
              className="connection-orbit"
              cx="260"
              cy="260"
              r="190"
            />

            <circle
              className="connection-orbit connection-orbit-inner"
              cx="260"
              cy="260"
              r="135"
            />

            <line
              className="connection-line"
              x1="260"
              y1="70"
              x2="420"
              y2="260"
            />

            <line
              className="connection-line"
              x1="420"
              y1="260"
              x2="260"
              y2="450"
            />

            <line
              className="connection-line"
              x1="260"
              y1="450"
              x2="100"
              y2="260"
            />

            <line
              className="connection-line"
              x1="100"
              y1="260"
              x2="260"
              y2="70"
            />

            <line
              className="connection-line"
              x1="260"
              y1="70"
              x2="260"
              y2="450"
            />

            <line
              className="connection-line"
              x1="100"
              y1="260"
              x2="420"
              y2="260"
            />

            <g className="connection-node">
              <circle cx="260" cy="70" r="34" />
              <text x="260" y="66">01</text>
              <text x="260" y="77">CODE</text>
            </g>

            <g className="connection-node">
              <circle cx="420" cy="260" r="34" />
              <text x="420" y="256">02</text>
              <text x="420" y="267">PROJECTS</text>
            </g>

            <g className="connection-node">
              <circle cx="260" cy="450" r="34" />
              <text x="260" y="446">03</text>
              <text x="260" y="457">PEOPLE</text>
            </g>

            <g className="connection-node">
              <circle cx="100" cy="260" r="34" />
              <text x="100" y="256">04</text>
              <text x="100" y="267">AI</text>
            </g>
          </svg>
        </div>
      </section>

      <section
        className="nexus-motion"
        aria-label="Engineering in motion"
      >
        <span className="section-index">
          05 / 06
        </span>

        <div className="motion-copy">
          <p>ENGINEERING IN MOTION</p>

          <h2>
            ENGINEERING
            <br />
            <span>IN MOTION.</span>
          </h2>

          <p className="motion-description">
            The system doesn't just store information.
            <br />
            It moves it.
          </p>
        </div>

        <div className="motion-system" aria-hidden="true">
          <div className="motion-orbit orbit-a" />
          <div className="motion-orbit orbit-b" />
          <div className="motion-orbit orbit-c" />

          <svg
            className="motion-lines"
            viewBox="0 0 700 700"
          >
            <line x1="350" y1="70" x2="570" y2="350" />
            <line x1="570" y1="350" x2="350" y2="630" />
            <line x1="350" y1="630" x2="130" y2="350" />
            <line x1="130" y1="350" x2="350" y2="70" />

            <line x1="350" y1="70" x2="350" y2="630" />
            <line x1="130" y1="350" x2="570" y2="350" />

            <line x1="210" y1="170" x2="490" y2="530" />
            <line x1="490" y1="170" x2="210" y2="530" />
          </svg>

          <div className="motion-node node-top">
            <span>01</span>
            <strong>INPUT</strong>
          </div>

          <div className="motion-node node-right">
            <span>02</span>
            <strong>PROCESS</strong>
          </div>

          <div className="motion-node node-bottom">
            <span>03</span>
            <strong>OUTPUT</strong>
          </div>

          <div className="motion-node node-left">
            <span>04</span>
            <strong>INTELLIGENCE</strong>
          </div>

          <div className="motion-core">
            <span>NEXUS</span>
          </div>

          <div className="motion-pulse pulse-one" />
          <div className="motion-pulse pulse-two" />
          <div className="motion-pulse pulse-three" />
        </div>
      </section>

      <section className="nexus-final" aria-label="Nexus">
        <span className="section-index">06 / 06</span>

        <div className="final-copy">
          <p>ENGINEERING INTELLIGENCE</p>

          <h2>
            BUILD
            <br />
            <span>THE SYSTEM.</span>
          </h2>

          <p className="final-description">
            Code. Knowledge. People. Intelligence.
            <br />
            One connected engineering system.
          </p>

          <button className="final-button">
            ENTER NEXUS
            <span>↗</span>
          </button>
        </div>

        <div className="final-mark" aria-hidden="true">
          <div className="final-ring ring-outer" />
          <div className="final-ring ring-inner" />

          <div className="final-core">
            <span>N</span>
          </div>

          <i className="final-point point-top" />
          <i className="final-point point-right" />
          <i className="final-point point-bottom" />
          <i className="final-point point-left" />
        </div>

        <div className="final-footer">
          <span>NEXUS / 2026</span>
          <span>CONNECTED ENGINEERING SYSTEM</span>
        </div>
      </section>
    </main>
  );
}