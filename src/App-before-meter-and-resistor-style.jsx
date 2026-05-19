import { useMemo, useState } from "react";

export default function App() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(12);
  const [showElectrons, setShowElectrons] = useState(false);
  const [studentMode, setStudentMode] = useState(false);

  const current = voltage / resistance;
  const power = voltage * current;
  const currentSpeed = Math.max(2.2, 8 - current * 1.5);

  const graphPoints = useMemo(() => {
    const maxV = 12;
    const maxI = 6;

    return Array.from({ length: 7 }, (_, i) => {
      const v = (maxV / 6) * i;
      const iValue = v / resistance;
      return {
        x: 50 + (v / maxV) * 420,
        y: 250 - (iValue / maxI) * 190,
      };
    });
  }, [resistance]);

  const graphPath = graphPoints
    .map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const activePoint = {
    x: 50 + (voltage / 12) * 420,
    y: 250 - ((voltage / resistance) / 6) * 190,
  };

  function reset() {
    setVoltage(6);
    setResistance(12);
    setShowElectrons(false);
    setStudentMode(false);
  }

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f6f0df;
          color: #30271e;
        }

        .app {
          min-height: 100vh;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(112, 160, 175, 0.22), transparent 32%),
            radial-gradient(circle at bottom right, rgba(196, 91, 65, 0.13), transparent 35%),
            #f6f0df;
        }

        .page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-icon {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #ddd2b8;
          display: grid;
          place-items: center;
          font-size: 28px;
          box-shadow: 0 8px 22px rgba(48, 39, 30, 0.08);
        }

        h1, h2, h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-weight: 600;
        }

        h1 {
          font-size: clamp(28px, 4vw, 46px);
          letter-spacing: -0.04em;
        }

        .subtitle {
          margin: 4px 0 0;
          color: #6f624d;
          font-size: 14px;
        }

        .header-buttons {
          display: flex;
          gap: 10px;
        }

        button {
          border: none;
          border-radius: 14px;
          padding: 11px 16px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
        }

        .button-dark {
          background: #30271e;
          color: white;
        }

        .button-light {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #d6c9aa;
          color: #30271e;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 230px 1fr 310px;
          gap: 16px;
        }

        .card {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid #ddd2b8;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(48, 39, 30, 0.07);
          overflow: hidden;
        }

        .card-content {
          padding: 18px;
        }

        .small-title {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          color: #5e523f;
          margin-bottom: 12px;
          font-weight: 800;
        }

        .topic {
          padding: 12px;
          border-radius: 16px;
          margin-bottom: 9px;
          background: rgba(255,255,255,0.45);
        }

        .topic.active {
          background: #dbeaf0;
          border: 1px solid #a9c6d0;
        }

        .topic-title {
          font-weight: 800;
          font-size: 14px;
        }

        .topic-subtitle {
          font-size: 12px;
          color: #6f624d;
          margin-top: 3px;
        }

        .switch-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin: 12px 0;
        }

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #30271e;
        }

        .studio-card .card-content {
          padding: 22px;
        }

        .studio-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .studio-title {
          font-size: clamp(28px, 4vw, 42px);
        }

        .prompt-box {
          max-width: 240px;
          background: #fff7d8;
          border: 1px solid #e3d39b;
          border-radius: 16px;
          padding: 12px;
          font-size: 13px;
          color: #5f5444;
        }

        .simulation {
          height: 360px;
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
          border-radius: 22px;
          overflow: hidden;
        }

        .lower-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .control-group {
          margin: 20px 0;
        }

        .control-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        input[type="range"] {
          width: 100%;
          accent-color: #30271e;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .value-box {
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
          border-radius: 18px;
          padding: 16px 8px;
          text-align: center;
        }

        .value-label {
          font-size: 12px;
          color: #6f624d;
        }

        .value-number {
          font-size: 26px;
          font-weight: 900;
          margin: 4px 0;
        }

        .value-unit {
          font-size: 12px;
        }

        .graph-box {
          margin-top: 16px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid #ddd2b8;
          border-radius: 24px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(48, 39, 30, 0.07);
        }

        .graph-area {
          margin-top: 10px;
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
          border-radius: 20px;
          overflow: hidden;
        }

        .equation-box {
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
          border-radius: 18px;
          text-align: center;
          padding: 16px;
          font-size: 30px;
          font-family: Georgia, serif;
          margin: 16px 0;
        }

        .definition {
          font-size: 14px;
          color: #5f5444;
          line-height: 1.5;
        }

        .variable-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #e7dcc7;
          padding: 9px 0;
          font-size: 14px;
        }

        .task-box {
          background: #fff7d8;
          border: 1px solid #e3d39b;
          border-radius: 16px;
          padding: 12px;
          font-size: 14px;
          line-height: 1.45;
        }

        .teacher-list {
          padding-left: 20px;
          margin: 0;
          color: #5f5444;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 1050px) {
          .main-grid {
            grid-template-columns: 1fr;
          }

          .lower-grid {
            grid-template-columns: 1fr;
          }

          .prompt-box {
            display: none;
          }
        }

        @media (max-width: 650px) {
          .app {
            padding: 12px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">⚡</div>
            <div>
              <h1>Physics Concept Studio</h1>
              <p className="subtitle">
                Interactive models, live graphs, variables, and classroom tasks
              </p>
            </div>
          </div>

          <div className="header-buttons">
            <button className="button-light" onClick={reset}>
              ↺ Reset
            </button>
            <button className="button-dark">📷 Screenshot</button>
          </div>
        </header>

        <main className="main-grid">
          <aside>
            <div className="card">
              <div className="card-content">
                <div className="small-title">TOPICS</div>

                <div className="topic active">
                  <div className="topic-title">Circuits</div>
                  <div className="topic-subtitle">Current, p.d. and resistance</div>
                </div>

                <div className="topic">
                  <div className="topic-title">Waves</div>
                  <div className="topic-subtitle">Superposition and standing waves</div>
                </div>

                <div className="topic">
                  <div className="topic-title">Optics</div>
                  <div className="topic-subtitle">Refraction and critical angle</div>
                </div>

                <div className="topic">
                  <div className="topic-title">Motion</div>
                  <div className="topic-subtitle">Graphs, forces and energy</div>
                </div>

                <div className="topic">
                  <div className="topic-title">Fields</div>
                  <div className="topic-subtitle">Electric and gravitational fields</div>
                </div>
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">MODEL LAYERS</div>

                <label className="switch-row">
                  Conventional current
                  <input type="checkbox" checked readOnly />
                </label>

                <label className="switch-row">
                  Electron drift
                  <input
                    type="checkbox"
                    checked={showElectrons}
                    onChange={(e) => setShowElectrons(e.target.checked)}
                  />
                </label>

                <label className="switch-row">
                  Student mode
                  <input
                    type="checkbox"
                    checked={studentMode}
                    onChange={(e) => setStudentMode(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </aside>

          <section>
            <div className="card studio-card">
              <div className="card-content">
                <div className="studio-top">
                  <div>
                    <h2 className="studio-title">Ohm’s Law Studio</h2>
                    <p className="subtitle">
                      Change voltage and resistance. Watch current, power, and the graph respond.
                    </p>
                  </div>

                  <div className="prompt-box">
                    <strong>Predict first:</strong>
                    <br />
                    What happens to current when resistance doubles?
                  </div>
                </div>

                <div className="simulation">
                  <svg viewBox="0 0 760 360" width="100%" height="100%">
                    <defs>
                      <marker
                        id="arrow"
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,6 L9,3 z" fill="#30271e" />
                      </marker>

                      <path
                        id="currentPath"
                        d="M170 124 V90 H350 M460 90 H610 V220 M610 290 H170 V160"
                        fill="none"
                      />

                      <path
                        id="electronPath"
                        d="M170 160 V290 H610 M610 220 V90 H460 M350 90 H170 V124"
                        fill="none"
                      />
                    </defs>

                    <rect width="760" height="360" fill="#f8f4e8" />

                    <text x="118" y="86" fill="#30271e" fontSize="15" fontWeight="700">Cell</text>

                    <text x="112" y="205" fill="#6f624d" fontSize="13">{voltage.toFixed(1)} V</text>

                    {/* Wires: the cell and resistor interrupt the circuit, so there is no wire drawn behind them. */}
                    <path
                      d="M170 124 V90 H350"
                      fill="none"
                      stroke="#30271e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M460 90 H610 V220"
                      fill="none"
                      stroke="#30271e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M610 290 H170 V160"
                      fill="none"
                      stroke="#30271e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Cell inserted into the left branch: long plate is positive, short plate is negative. */}
                    <line
                      x1="140"
                      y1="124"
                      x2="200"
                      y2="124"
                      stroke="#30271e"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <line
                      x1="153"
                      y1="160"
                      x2="187"
                      y2="160"
                      stroke="#30271e"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <text x="214" y="112" fill="#30271e" fontSize="16" fontWeight="800">+</text>
                    <text x="214" y="180" fill="#30271e" fontSize="16" fontWeight="800">−</text>

                    {/* Resistor inserted into the top branch. */}
                    <line
                      x1="350"
                      y1="90"
                      x2="365"
                      y2="90"
                      stroke="#30271e"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="445"
                      y1="90"
                      x2="460"
                      y2="90"
                      stroke="#30271e"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <rect
                      x="365"
                      y="63"
                      width="80"
                      height="54"
                      rx="14"
                      fill="#fff"
                      stroke="#30271e"
                      strokeWidth="4"
                    />
                    <path
                      d="M378 90 h10 l10 -14 l14 28 l14 -28 l14 28 l10 -14 h10"
                      fill="none"
                      stroke="#c45b41"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text x="382" y="46" fill="#30271e" fontSize="15" fontWeight="700">
                      Resistor
                    </text>
                    <text x="470" y="126" fill="#6f624d" fontSize="13">R = {resistance.toFixed(1)} Ω</text>

                    {/* Voltmeter in parallel across the resistor. */}
                    <path
                      d="M350 90 V160"
                      fill="none"
                      stroke="#7c6d56"
                      strokeWidth="3"
                      strokeDasharray="5 5"
                    />
                    <path
                      d="M460 90 V160"
                      fill="none"
                      stroke="#7c6d56"
                      strokeWidth="3"
                      strokeDasharray="5 5"
                    />
                    <path d="M350 160 H377" fill="none" stroke="#7c6d56" strokeWidth="3" />
                    <path d="M433 160 H460" fill="none" stroke="#7c6d56" strokeWidth="3" />
                    <circle
                      cx="405"
                      cy="160"
                      r="28"
                      fill="#fff"
                      stroke="#30271e"
                      strokeWidth="4"
                    />
                    <text
                      x="405"
                      y="170"
                      textAnchor="middle"
                      fill="#30271e"
                      fontSize="28"
                      fontWeight="900"
                    >
                      V
                    </text>
                    <text x="383" y="215" fill="#6f624d" fontSize="13">{voltage.toFixed(1)} V</text>

                    {/* Ammeter in series on the right branch. */}
                    <circle
                      cx="610"
                      cy="255"
                      r="35"
                      fill="#fff"
                      stroke="#30271e"
                      strokeWidth="4"
                    />
                    <text
                      x="610"
                      y="267"
                      textAnchor="middle"
                      fill="#30271e"
                      fontSize="30"
                      fontWeight="900"
                    >
                      A
                    </text>
                    <text x="575" y="315" fill="#6f624d" fontSize="13">
                      {studentMode ? "? A" : `${current.toFixed(2)} A`}
                    </text>

                    {/* Current direction arrows. */}
                    <path
                      d="M230 90 H305"
                      stroke="#30271e"
                      strokeWidth="3"
                      markerEnd="url(#arrow)"
                    />
                    <path
                      d="M610 145 V205"
                      stroke="#30271e"
                      strokeWidth="3"
                      markerEnd="url(#arrow)"
                    />
                    <path
                      d="M500 290 H425"
                      stroke="#30271e"
                      strokeWidth="3"
                      markerEnd="url(#arrow)"
                    />
                    <text x="470" y="76" fill="#30271e" fontSize="13" fontWeight="600">
                      conventional current
                    </text>

                    {[0, 1, 2, 3, 4].map((n) => (
                      <circle key={`current-${n}`} r="7" fill="#4b8aa0">
                        <animateMotion
                          dur={`${currentSpeed}s`}
                          repeatCount="indefinite"
                          begin={`${n * 0.55}s`}
                        >
                          <mpath href="#currentPath" />
                        </animateMotion>
                      </circle>
                    ))}

                    {showElectrons &&
                      [0, 1, 2, 3].map((n) => (
                        <circle key={`electron-${n}`} r="5" fill="#7656a8">
                          <animateMotion
                            dur={`${currentSpeed + 1}s`}
                            repeatCount="indefinite"
                            begin={`${n * 0.65}s`}
                          >
                            <mpath href="#electronPath" />
                          </animateMotion>
                        </circle>
                      ))}
                  </svg>
                </div>
              </div>
            </div>

            <div className="lower-grid">
              <div className="card">
                <div className="card-content">
                  <h3>Controls</h3>

                  <div className="control-group">
                    <div className="control-label">
                      <span>Potential difference, V</span>
                      <strong>{voltage.toFixed(1)} V</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="0.5"
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                    />
                  </div>

                  <div className="control-group">
                    <div className="control-label">
                      <span>Resistance, R</span>
                      <strong>{resistance.toFixed(1)} Ω</strong>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="1"
                      value={resistance}
                      onChange={(e) => setResistance(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <h3>Live Values</h3>
                  <br />
                  <div className="values-grid">
                    <div className="value-box">
                      <div className="value-label">Current</div>
                      <div className="value-number">
                        {studentMode ? "?" : current.toFixed(2)}
                      </div>
                      <div className="value-unit">A</div>
                    </div>

                    <div className="value-box">
                      <div className="value-label">Power</div>
                      <div className="value-number">
                        {studentMode ? "?" : power.toFixed(2)}
                      </div>
                      <div className="value-unit">W</div>
                    </div>

                    <div className="value-box">
                      <div className="value-label">Resistance</div>
                      <div className="value-number">
                        {studentMode ? "?" : resistance.toFixed(0)}
                      </div>
                      <div className="value-unit">Ω</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="graph-box">
              <h3>Live graph: current against potential difference</h3>
              <p className="subtitle">
                For a fixed resistance, the graph is a straight line through the origin. Increasing resistance makes the line less steep.
              </p>

              <div className="graph-area">
                <svg viewBox="0 0 520 290" width="100%" height="270">
                  <rect width="520" height="290" fill="#f8f4e8" />

                  <line x1="50" y1="250" x2="490" y2="250" stroke="#30271e" strokeWidth="3" />
                  <line x1="50" y1="250" x2="50" y2="35" stroke="#30271e" strokeWidth="3" />

                  <text x="260" y="282" textAnchor="middle" fill="#30271e" fontSize="12">
                    Potential difference V / V
                  </text>

                  <text
                    x="13"
                    y="145"
                    textAnchor="middle"
                    fill="#30271e"
                    fontSize="12"
                    transform="rotate(-90 13 145)"
                  >
                    Current I / A
                  </text>

                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <g key={n}>
                      <line
                        x1={50 + n * 70}
                        y1="250"
                        x2={50 + n * 70}
                        y2="255"
                        stroke="#30271e"
                      />
                      <text
                        x={50 + n * 70}
                        y="270"
                        textAnchor="middle"
                        fill="#6f624d"
                        fontSize="10"
                      >
                        {n * 2}
                      </text>
                    </g>
                  ))}

                  <path
                    d={graphPath}
                    fill="none"
                    stroke="#4b8aa0"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {graphPoints.map((p, index) => (
                    <circle key={index} cx={p.x} cy={p.y} r="5" fill="#30271e" />
                  ))}

                  <circle cx={activePoint.x} cy={activePoint.y} r="9" fill="#c45b41" />
                </svg>
              </div>
            </div>
          </section>

          <aside>
            <div className="card">
              <div className="card-content">
                <div className="small-title">CONCEPT DETAILS</div>
                <h3>Ohm’s Law</h3>

                <p className="definition">
                  For an ohmic conductor at constant temperature, current is directly
                  proportional to potential difference.
                </p>

                <div className="equation-box">I = V / R</div>

                <div className="variable-row">
                  <strong>V</strong>
                  <span>potential difference</span>
                </div>

                <div className="variable-row">
                  <strong>I</strong>
                  <span>current</span>
                </div>

                <div className="variable-row">
                  <strong>R</strong>
                  <span>resistance</span>
                </div>
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">STUDENT TASK</div>

                <p className="definition">
                  Set the voltage to 8 V. Adjust the resistance until the current is
                  about 0.50 A.
                </p>

                <div className="task-box">
                  Then explain why increasing resistance reduces the current.
                </div>
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">TEACHER NOTES</div>

                <ul className="teacher-list">
                  <li>Good for Grade 10 current and p.d.</li>
                  <li>Connect graph gradient to resistance.</li>
                  <li>Use student mode before revealing values.</li>
                  <li>Extend later to series and parallel circuits.</li>
                </ul>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
