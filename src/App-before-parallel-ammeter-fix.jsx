import { useMemo, useState } from "react";

export default function App() {
  const [mode, setMode] = useState("series");
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(30);
  const [useThird, setUseThird] = useState(false);
  const [studentMode, setStudentMode] = useState(false);
  const [predictionR, setPredictionR] = useState("");
  const [predictionI, setPredictionI] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  const resistors = useThird ? [r1, r2, r3] : [r1, r2];

  const equivalentResistance = useMemo(() => {
    if (mode === "series") {
      return resistors.reduce((sum, r) => sum + r, 0);
    }

    return 1 / resistors.reduce((sum, r) => sum + 1 / r, 0);
  }, [mode, resistors]);

  const totalCurrent = supplyVoltage / equivalentResistance;
  const totalPower = supplyVoltage * totalCurrent;

  const rows = resistors.map((resistance, index) => {
    if (mode === "series") {
      const current = totalCurrent;
      const voltage = current * resistance;
      const power = voltage * current;
      return { index, resistance, current, voltage, power };
    }

    const voltage = supplyVoltage;
    const current = voltage / resistance;
    const power = voltage * current;
    return { index, resistance, current, voltage, power };
  });

  function reset() {
    setMode("series");
    setSupplyVoltage(12);
    setR1(10);
    setR2(20);
    setR3(30);
    setUseThird(false);
    setStudentMode(false);
    setPredictionR("");
    setPredictionI("");
    setCheckResult(null);
  }

  function generateChallenge() {
    const values = [5, 10, 15, 20, 25, 30, 40, 50, 60];
    const random = () => values[Math.floor(Math.random() * values.length)];

    setSupplyVoltage([6, 9, 12, 15, 18][Math.floor(Math.random() * 5)]);
    setR1(random());
    setR2(random());
    setR3(random());
    setUseThird(Math.random() > 0.5);
    setMode(Math.random() > 0.5 ? "series" : "parallel");
    setPredictionR("");
    setPredictionI("");
    setCheckResult(null);
  }

  function checkAnswers() {
    const predictedR = Number(predictionR);
    const predictedI = Number(predictionI);

    const rTolerance = Math.max(0.05, equivalentResistance * 0.02);
    const iTolerance = Math.max(0.01, totalCurrent * 0.02);

    const rCorrect = Math.abs(predictedR - equivalentResistance) <= rTolerance;
    const iCorrect = Math.abs(predictedI - totalCurrent) <= iTolerance;

    setCheckResult({ rCorrect, iCorrect });
  }

  const hidden = studentMode ? "?" : null;

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
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
          max-width: 1450px;
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
          background: rgba(255,255,255,0.72);
          border: 1px solid #ddd2b8;
          display: grid;
          place-items: center;
          font-size: 28px;
        }

        h1, h2, h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-weight: 700;
        }

        h1 {
          font-size: clamp(30px, 4vw, 48px);
          letter-spacing: -0.04em;
        }

        .subtitle {
          color: #6f624d;
          font-size: 14px;
          margin-top: 6px;
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
          background: rgba(255,255,255,0.72);
          border: 1px solid #d6c9aa;
          color: #30271e;
        }

        .header-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 250px 1fr 330px;
          gap: 16px;
        }

        .card {
          background: rgba(255,255,255,0.74);
          border: 1px solid #ddd2b8;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(48,39,30,0.07);
          overflow: hidden;
        }

        .card-content {
          padding: 18px;
        }

        .small-title {
          font-family: monospace;
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

        .mode-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .mode-button {
          background: #f8f4e8;
          border: 1px solid #d6c9aa;
          color: #30271e;
        }

        .mode-button.active {
          background: #30271e;
          color: white;
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

        input[type="range"] {
          width: 100%;
          accent-color: #30271e;
        }

        input[type="number"] {
          width: 100%;
          border: 1px solid #d6c9aa;
          border-radius: 12px;
          padding: 10px;
          font-size: 15px;
          background: #fffdf6;
          color: #30271e;
        }

        .control-group {
          margin: 18px 0;
        }

        .control-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .studio-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .studio-title {
          font-size: clamp(30px, 4vw, 44px);
        }

        .prompt-box {
          max-width: 260px;
          background: #fff7d8;
          border: 1px solid #e3d39b;
          border-radius: 16px;
          padding: 12px;
          font-size: 13px;
          color: #5f5444;
          line-height: 1.45;
        }

        .simulation {
          height: 390px;
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
          border-radius: 22px;
          overflow: hidden;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 16px;
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
          font-size: 25px;
          font-weight: 900;
          margin: 4px 0;
        }

        .value-unit {
          font-size: 12px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
          font-size: 13px;
        }

        .data-table th,
        .data-table td {
          border-bottom: 1px solid #e7dcc7;
          padding: 9px 6px;
          text-align: right;
        }

        .data-table th:first-child,
        .data-table td:first-child {
          text-align: left;
        }

        .formula-box {
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
          border-radius: 18px;
          padding: 14px;
          font-family: Georgia, serif;
          font-size: 20px;
          line-height: 1.5;
          margin: 12px 0;
        }

        .task-box {
          background: #fff7d8;
          border: 1px solid #e3d39b;
          border-radius: 16px;
          padding: 12px;
          font-size: 14px;
          line-height: 1.45;
        }

        .check-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 12px 0;
        }

        .feedback {
          margin-top: 12px;
          border-radius: 14px;
          padding: 12px;
          font-size: 14px;
          background: #f8f4e8;
          border: 1px solid #e1d7bf;
        }

        .good {
          color: #1f6b43;
          font-weight: 800;
        }

        .bad {
          color: #9b3d2e;
          font-weight: 800;
        }

        .bar {
          height: 8px;
          background: #e9dfc9;
          border-radius: 999px;
          overflow: hidden;
          margin-top: 8px;
        }

        .bar-fill {
          height: 100%;
          background: #4b8aa0;
          border-radius: 999px;
        }

        @media (max-width: 1100px) {
          .main-grid {
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

          .summary-grid,
          .check-grid {
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
                Series and parallel resistors tester
              </p>
            </div>
          </div>

          <div className="header-buttons">
            <button className="button-light" onClick={generateChallenge}>
              🎲 New challenge
            </button>
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

                <div className="topic">
                  <div className="topic-title">Ohm’s Law</div>
                  <div className="topic-subtitle">V, I and R relationship</div>
                </div>

                <div className="topic active">
                  <div className="topic-title">Series & Parallel</div>
                  <div className="topic-subtitle">Equivalent resistance tester</div>
                </div>

                <div className="topic">
                  <div className="topic-title">Potential Dividers</div>
                  <div className="topic-subtitle">Voltage sharing</div>
                </div>

                <div className="topic">
                  <div className="topic-title">Resistance of a Wire</div>
                  <div className="topic-subtitle">Length, area and resistivity</div>
                </div>
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">TEST MODE</div>

                <div className="mode-buttons">
                  <button
                    className={mode === "series" ? "mode-button active" : "mode-button"}
                    onClick={() => {
                      setMode("series");
                      setCheckResult(null);
                    }}
                  >
                    Series
                  </button>

                  <button
                    className={mode === "parallel" ? "mode-button active" : "mode-button"}
                    onClick={() => {
                      setMode("parallel");
                      setCheckResult(null);
                    }}
                  >
                    Parallel
                  </button>
                </div>

                <label className="switch-row">
                  Use third resistor
                  <input
                    type="checkbox"
                    checked={useThird}
                    onChange={(e) => {
                      setUseThird(e.target.checked);
                      setCheckResult(null);
                    }}
                  />
                </label>

                <label className="switch-row">
                  Student mode
                  <input
                    type="checkbox"
                    checked={studentMode}
                    onChange={(e) => {
                      setStudentMode(e.target.checked);
                      setCheckResult(null);
                    }}
                  />
                </label>
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">CONTROLS</div>

                <div className="control-group">
                  <div className="control-label">
                    <span>Supply voltage</span>
                    <strong>{supplyVoltage.toFixed(1)} V</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="0.5"
                    value={supplyVoltage}
                    onChange={(e) => setSupplyVoltage(Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <div className="control-label">
                    <span>R1</span>
                    <strong>{r1.toFixed(1)} Ω</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={r1}
                    onChange={(e) => setR1(Number(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <div className="control-label">
                    <span>R2</span>
                    <strong>{r2.toFixed(1)} Ω</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={r2}
                    onChange={(e) => setR2(Number(e.target.value))}
                  />
                </div>

                {useThird && (
                  <div className="control-group">
                    <div className="control-label">
                      <span>R3</span>
                      <strong>{r3.toFixed(1)} Ω</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={r3}
                      onChange={(e) => setR3(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section>
            <div className="card">
              <div className="card-content">
                <div className="studio-top">
                  <div>
                    <h2 className="studio-title">
                      {mode === "series" ? "Series Resistors Tester" : "Parallel Resistors Tester"}
                    </h2>
                    <p className="subtitle">
                      Change the resistors and see how the equivalent resistance, total current and individual values respond.
                    </p>
                  </div>

                  <div className="prompt-box">
                    <strong>Predict first:</strong>
                    <br />
                    In {mode}, does adding another resistor make the total resistance larger or smaller?
                  </div>
                </div>

                <div className="simulation">
                  {mode === "series" ? (
                    <SeriesDiagram
                      supplyVoltage={supplyVoltage}
                      resistors={resistors}
                      totalCurrent={totalCurrent}
                    />
                  ) : (
                    <ParallelDiagram
                      supplyVoltage={supplyVoltage}
                      resistors={resistors}
                      rows={rows}
                    />
                  )}
                </div>

                <div className="summary-grid">
                  <div className="value-box">
                    <div className="value-label">Equivalent resistance</div>
                    <div className="value-number">
                      {hidden ?? equivalentResistance.toFixed(2)}
                    </div>
                    <div className="value-unit">Ω</div>
                  </div>

                  <div className="value-box">
                    <div className="value-label">Total current</div>
                    <div className="value-number">
                      {hidden ?? totalCurrent.toFixed(2)}
                    </div>
                    <div className="value-unit">A</div>
                  </div>

                  <div className="value-box">
                    <div className="value-label">Total power</div>
                    <div className="value-number">
                      {hidden ?? totalPower.toFixed(2)}
                    </div>
                    <div className="value-unit">W</div>
                  </div>
                </div>
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <h3>Live resistor data</h3>
                <p className="subtitle">
                  Use this table to compare what stays the same and what changes.
                </p>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Resistor</th>
                      <th>R / Ω</th>
                      <th>V / V</th>
                      <th>I / A</th>
                      <th>P / W</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.index}>
                        <td>R{row.index + 1}</td>
                        <td>{row.resistance.toFixed(1)}</td>
                        <td>{studentMode ? "?" : row.voltage.toFixed(2)}</td>
                        <td>{studentMode ? "?" : row.current.toFixed(2)}</td>
                        <td>{studentMode ? "?" : row.power.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside>
            <div className="card">
              <div className="card-content">
                <div className="small-title">RULES</div>

                {mode === "series" ? (
                  <>
                    <h3>Series</h3>
                    <div className="formula-box">
                      R<sub>total</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub>
                    </div>
                    <p className="subtitle">
                      In series, the current is the same through every resistor. The supply voltage is shared between the resistors.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>Parallel</h3>
                    <div className="formula-box">
                      1/R<sub>total</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + 1/R<sub>3</sub>
                    </div>
                    <p className="subtitle">
                      In parallel, the voltage is the same across every branch. The total current is the sum of the branch currents.
                    </p>
                  </>
                )}
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">STUDENT TESTER</div>

                <div className="task-box">
                  Predict the equivalent resistance and total current, then check your answer.
                </div>

                <div className="check-grid">
                  <div>
                    <p className="subtitle">Predicted Rtotal / Ω</p>
                    <input
                      type="number"
                      value={predictionR}
                      onChange={(e) => setPredictionR(e.target.value)}
                      placeholder="e.g. 30"
                    />
                  </div>

                  <div>
                    <p className="subtitle">Predicted Itotal / A</p>
                    <input
                      type="number"
                      value={predictionI}
                      onChange={(e) => setPredictionI(e.target.value)}
                      placeholder="e.g. 0.40"
                    />
                  </div>
                </div>

                <button className="button-dark" onClick={checkAnswers}>
                  Check prediction
                </button>

                {checkResult && (
                  <div className="feedback">
                    <div>
                      Equivalent resistance:{" "}
                      <span className={checkResult.rCorrect ? "good" : "bad"}>
                        {checkResult.rCorrect ? "correct" : "check again"}
                      </span>
                    </div>
                    <div>
                      Total current:{" "}
                      <span className={checkResult.iCorrect ? "good" : "bad"}>
                        {checkResult.iCorrect ? "correct" : "check again"}
                      </span>
                    </div>
                    {!studentMode && (
                      <p className="subtitle">
                        Correct values: Rtotal = {equivalentResistance.toFixed(2)} Ω, Itotal = {totalCurrent.toFixed(2)} A
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <br />

            <div className="card">
              <div className="card-content">
                <div className="small-title">POWER COMPARISON</div>

                {rows.map((row) => {
                  const maxPower = Math.max(...rows.map((r) => r.power));
                  const percent = maxPower === 0 ? 0 : (row.power / maxPower) * 100;

                  return (
                    <div key={row.index} style={{ marginBottom: "14px" }}>
                      <div className="control-label">
                        <span>R{row.index + 1}</span>
                        <strong>{studentMode ? "?" : `${row.power.toFixed(2)} W`}</strong>
                      </div>
                      <div className="bar">
                        <div className="bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function SeriesDiagram({ supplyVoltage, resistors, totalCurrent }) {
  const hasThree = resistors.length === 3;

  return (
    <svg viewBox="0 0 850 390" width="100%" height="100%">
      <defs>
        <marker id="arrowSeries" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#30271e" />
        </marker>
      </defs>

      <rect width="850" height="390" fill="#f8f4e8" />

      <text x="80" y="74" fill="#30271e" fontSize="16" fontWeight="800">
        V = {supplyVoltage.toFixed(1)} V
      </text>

      <line x1="105" y1="120" x2="165" y2="120" stroke="#30271e" strokeWidth="7" strokeLinecap="round" />
      <line x1="118" y1="168" x2="152" y2="168" stroke="#30271e" strokeWidth="5" strokeLinecap="round" />
      <text x="173" y="124" fill="#30271e" fontSize="16" fontWeight="800">+</text>
      <text x="163" y="174" fill="#30271e" fontSize="16" fontWeight="800">−</text>

      <path d="M135 120 V90 H230" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
      <path d="M135 168 V300 H720 V255" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      <ResistorBox x={230} y={66} label={`R1 = ${resistors[0].toFixed(1)} Ω`} />
      <path d="M350 90 H390" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      <ResistorBox x={390} y={66} label={`R2 = ${resistors[1].toFixed(1)} Ω`} />

      {hasThree ? (
        <>
          <path d="M510 90 H550" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
          <ResistorBox x={550} y={66} label={`R3 = ${resistors[2].toFixed(1)} Ω`} />
          <path d="M670 90 H720 V185" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
        </>
      ) : (
        <path d="M510 90 H720 V185" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
      )}

      <circle cx="720" cy="220" r="27" fill="#fff" stroke="#30271e" strokeWidth="4" />
      <text x="720" y="229" textAnchor="middle" fill="#30271e" fontSize="26" fontWeight="900">A</text>
      <line x1="720" y1="185" x2="720" y2="193" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
      <line x1="720" y1="247" x2="720" y2="255" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      <path d="M185 90 H220" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowSeries)" />
      <path d="M720 130 V175" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowSeries)" />
      <path d="M610 300 H560" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowSeries)" />

      <text x="550" y="340" fill="#6f624d" fontSize="14">
        Same current everywhere: I = {totalCurrent.toFixed(2)} A
      </text>
    </svg>
  );
}

function ParallelDiagram({ supplyVoltage, resistors, rows }) {
  const branchPositions = resistors.length === 3 ? [270, 430, 590] : [330, 510];

  return (
    <svg viewBox="0 0 850 390" width="100%" height="100%">
      <defs>
        <marker id="arrowParallel" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#30271e" />
        </marker>
      </defs>

      <rect width="850" height="390" fill="#f8f4e8" />

      <text x="80" y="74" fill="#30271e" fontSize="16" fontWeight="800">
        V = {supplyVoltage.toFixed(1)} V
      </text>

      <line x1="105" y1="120" x2="165" y2="120" stroke="#30271e" strokeWidth="7" strokeLinecap="round" />
      <line x1="118" y1="168" x2="152" y2="168" stroke="#30271e" strokeWidth="5" strokeLinecap="round" />
      <text x="173" y="124" fill="#30271e" fontSize="16" fontWeight="800">+</text>
      <text x="163" y="174" fill="#30271e" fontSize="16" fontWeight="800">−</text>

      <path d="M135 120 V90 H720 V185" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
      <path d="M135 168 V300 H720 V255" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      <circle cx="720" cy="220" r="27" fill="#fff" stroke="#30271e" strokeWidth="4" />
      <text x="720" y="229" textAnchor="middle" fill="#30271e" fontSize="26" fontWeight="900">A</text>
      <line x1="720" y1="185" x2="720" y2="193" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
      <line x1="720" y1="247" x2="720" y2="255" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      {branchPositions.map((x, index) => (
        <g key={index}>
          <path d={`M${x} 90 V150`} stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
          <rect x={x - 38} y="150" width="76" height="56" rx="10" fill="#fff" stroke="#30271e" strokeWidth="4" />
          <text x={x} y="144" textAnchor="middle" fill="#30271e" fontSize="14" fontWeight="800">
            R{index + 1} = {resistors[index].toFixed(1)} Ω
          </text>
          <text x={x} y="184" textAnchor="middle" fill="#6f624d" fontSize="13">
            I = {rows[index].current.toFixed(2)} A
          </text>
          <path d={`M${x} 206 V300`} stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
        </g>
      ))}

      <path d="M190 90 H250" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowParallel)" />
      <path d="M720 130 V175" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowParallel)" />
      <path d="M610 300 H560" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowParallel)" />

      <text x="490" y="340" fill="#6f624d" fontSize="14">
        Same voltage across every branch: V = {supplyVoltage.toFixed(1)} V
      </text>
    </svg>
  );
}

function ResistorBox({ x, y, label }) {
  return (
    <g>
      <rect x={x} y={y} width="120" height="48" rx="10" fill="#fff" stroke="#30271e" strokeWidth="4" />
      <text x={x + 60} y={y - 10} textAnchor="middle" fill="#30271e" fontSize="14" fontWeight="800">
        {label}
      </text>
    </g>
  );
}
