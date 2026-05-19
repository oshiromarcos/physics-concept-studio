import { useMemo, useState } from "react";

export default function App() {
  const [page, setPage] = useState("series-parallel");

  return (
    <div className="app">
      <StyleBlock />

      <div className="page">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">⚡</div>
            <div>
              <h1>Physics Concept Studio</h1>
              <p className="subtitle">
                Interactive circuit models, live values, and student testing tools
              </p>
            </div>
          </div>
        </header>

        <main className="main-grid">
          <aside>
            <Navigation page={page} setPage={setPage} />
          </aside>

          {page === "ohms-law" ? <OhmsLawPage /> : <SeriesParallelPage />}
        </main>
      </div>
    </div>
  );
}

function Navigation({ page, setPage }) {
  return (
    <>
      <div className="card">
        <div className="card-content">
          <div className="small-title">TOPICS</div>

          <button
            className={page === "ohms-law" ? "topic active topic-button" : "topic topic-button"}
            onClick={() => setPage("ohms-law")}
          >
            <div className="topic-title">Ohm’s Law</div>
            <div className="topic-subtitle">V, I and R relationship</div>
          </button>

          <button
            className={page === "series-parallel" ? "topic active topic-button" : "topic topic-button"}
            onClick={() => setPage("series-parallel")}
          >
            <div className="topic-title">Series & Parallel</div>
            <div className="topic-subtitle">Equivalent resistance tester</div>
          </button>

          <div className="topic muted">
            <div className="topic-title">Potential Dividers</div>
            <div className="topic-subtitle">Coming next</div>
          </div>

          <div className="topic muted">
            <div className="topic-title">Resistance of a Wire</div>
            <div className="topic-subtitle">Coming next</div>
          </div>
        </div>
      </div>
    </>
  );
}

function OhmsLawPage() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(12);
  const [studentMode, setStudentMode] = useState(false);
  const [showElectrons, setShowElectrons] = useState(false);

  const current = voltage / resistance;
  const power = voltage * current;
  const speed = Math.max(2.2, 8 - current * 1.5);

  const graphPoints = useMemo(() => {
    const maxV = 12;
    const maxI = 6;

    return Array.from({ length: 7 }, (_, n) => {
      const v = (maxV / 6) * n;
      const i = v / resistance;
      return {
        x: 50 + (v / maxV) * 420,
        y: 250 - (i / maxI) * 190,
      };
    });
  }, [resistance]);

  const graphPath = graphPoints
    .map((p, n) => `${n === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const activePoint = {
    x: 50 + (voltage / 12) * 420,
    y: 250 - ((voltage / resistance) / 6) * 190,
  };

  function reset() {
    setVoltage(6);
    setResistance(12);
    setStudentMode(false);
    setShowElectrons(false);
  }

  return (
    <>
      <section>
        <div className="card">
          <div className="card-content">
            <div className="studio-top">
              <div>
                <h2 className="studio-title">Ohm’s Law Studio</h2>
                <p className="subtitle">
                  Change voltage and resistance. Watch current, power, and graph steepness respond.
                </p>
              </div>

              <div className="prompt-box">
                <strong>Predict first:</strong>
                <br />
                What happens to current when resistance doubles?
              </div>
            </div>

            <div className="simulation">
              <svg viewBox="0 0 850 390" width="100%" height="100%">
                <defs>
                  <marker id="arrowOhm" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#30271e" />
                  </marker>

                  <path id="currentPathOhm" d="M150 120 V90 H350 M470 90 H720 V210 M720 265 V300 H150 V168" fill="none" />
                  <path id="electronPathOhm" d="M150 168 V300 H720 V265 M720 210 V90 H470 M350 90 H150 V120" fill="none" />
                </defs>

                <rect width="850" height="390" fill="#f8f4e8" />

                <text x="86" y="76" fill="#30271e" fontSize="16" fontWeight="800">
                  V = {voltage.toFixed(1)} V
                </text>

                <line x1="120" y1="120" x2="180" y2="120" stroke="#30271e" strokeWidth="7" strokeLinecap="round" />
                <line x1="133" y1="168" x2="167" y2="168" stroke="#30271e" strokeWidth="5" strokeLinecap="round" />
                <text x="188" y="124" fill="#30271e" fontSize="16" fontWeight="800">+</text>
                <text x="178" y="174" fill="#30271e" fontSize="16" fontWeight="800">−</text>

                <path d="M150 120 V90 H350" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
                <path d="M470 90 H720 V210" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
                <path d="M720 265 V300 H150 V168" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

                <rect x="350" y="66" width="120" height="48" rx="10" fill="#fff" stroke="#30271e" strokeWidth="4" />
                <text x="410" y="50" textAnchor="middle" fill="#30271e" fontSize="15" fontWeight="800">
                  R = {resistance.toFixed(1)} Ω
                </text>

                <path d="M350 90 V160 H382" fill="none" stroke="#7c6d56" strokeWidth="3" strokeDasharray="5 5" />
                <path d="M470 90 V160 H438" fill="none" stroke="#7c6d56" strokeWidth="3" strokeDasharray="5 5" />
                <circle cx="410" cy="160" r="26" fill="#fff" stroke="#30271e" strokeWidth="4" />
                <text x="410" y="169" textAnchor="middle" fill="#30271e" fontSize="26" fontWeight="900">V</text>
                <text x="386" y="210" fill="#6f624d" fontSize="13">
                  {voltage.toFixed(1)} V
                </text>

                <line x1="720" y1="210" x2="720" y2="221" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
                <circle cx="720" cy="243" r="26" fill="#fff" stroke="#30271e" strokeWidth="4" />
                <text x="720" y="252" textAnchor="middle" fill="#30271e" fontSize="26" fontWeight="900">A</text>
                <line x1="720" y1="265" x2="720" y2="276" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
                <text x="690" y="318" fill="#6f624d" fontSize="13">
                  {studentMode ? "? A" : `${current.toFixed(2)} A`}
                </text>

                <path d="M225 90 H305" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowOhm)" />
                <path d="M720 130 V190" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowOhm)" />
                <path d="M610 300 H550" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowOhm)" />

                <text x="520" y="76" fill="#30271e" fontSize="13" fontWeight="700">
                  conventional current
                </text>

                {[0, 1, 2, 3, 4].map((n) => (
                  <circle key={`current-${n}`} r="7" fill="#4b8aa0">
                    <animateMotion dur={`${speed}s`} repeatCount="indefinite" begin={`${n * 0.55}s`}>
                      <mpath href="#currentPathOhm" />
                    </animateMotion>
                  </circle>
                ))}

                {showElectrons &&
                  [0, 1, 2, 3].map((n) => (
                    <circle key={`electron-${n}`} r="5" fill="#7656a8">
                      <animateMotion dur={`${speed + 1}s`} repeatCount="indefinite" begin={`${n * 0.65}s`}>
                        <mpath href="#electronPathOhm" />
                      </animateMotion>
                    </circle>
                  ))}
              </svg>
            </div>

            <div className="summary-grid">
              <ValueBox label="Current" value={studentMode ? "?" : current.toFixed(2)} unit="A" />
              <ValueBox label="Power" value={studentMode ? "?" : power.toFixed(2)} unit="W" />
              <ValueBox label="Resistance" value={studentMode ? "?" : resistance.toFixed(1)} unit="Ω" />
            </div>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <h3>Live graph: current against potential difference</h3>
            <p className="subtitle">
              The vertical scale is fixed, so increasing resistance makes the line less steep.
            </p>

            <div className="graph-area">
              <svg viewBox="0 0 520 290" width="100%" height="270">
                <rect width="520" height="290" fill="#f8f4e8" />

                <line x1="50" y1="250" x2="490" y2="250" stroke="#30271e" strokeWidth="3" />
                <line x1="50" y1="250" x2="50" y2="35" stroke="#30271e" strokeWidth="3" />

                <text x="260" y="282" textAnchor="middle" fill="#30271e" fontSize="12">
                  Potential difference V / V
                </text>

                <text x="13" y="145" textAnchor="middle" fill="#30271e" fontSize="12" transform="rotate(-90 13 145)">
                  Current I / A
                </text>

                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <g key={n}>
                    <line x1={50 + n * 70} y1="250" x2={50 + n * 70} y2="255" stroke="#30271e" />
                    <text x={50 + n * 70} y="270" textAnchor="middle" fill="#6f624d" fontSize="10">
                      {n * 2}
                    </text>
                  </g>
                ))}

                <path d={graphPath} fill="none" stroke="#4b8aa0" strokeWidth="5" strokeLinecap="round" />

                {graphPoints.map((p, index) => (
                  <circle key={index} cx={p.x} cy={p.y} r="5" fill="#30271e" />
                ))}

                <circle cx={activePoint.x} cy={activePoint.y} r="9" fill="#c45b41" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <aside>
        <div className="card">
          <div className="card-content">
            <div className="small-title">CONTROLS</div>

            <div className="control-group">
              <div className="control-label">
                <span>Potential difference</span>
                <strong>{voltage.toFixed(1)} V</strong>
              </div>
              <input type="range" min="1" max="12" step="0.5" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
            </div>

            <div className="control-group">
              <div className="control-label">
                <span>Resistance</span>
                <strong>{resistance.toFixed(1)} Ω</strong>
              </div>
              <input type="range" min="2" max="30" step="1" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} />
            </div>

            <label className="switch-row">
              Student mode
              <input type="checkbox" checked={studentMode} onChange={(e) => setStudentMode(e.target.checked)} />
            </label>

            <label className="switch-row">
              Electron drift
              <input type="checkbox" checked={showElectrons} onChange={(e) => setShowElectrons(e.target.checked)} />
            </label>

            <button className="button-light full" onClick={reset}>↺ Reset</button>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <div className="small-title">CONCEPT</div>
            <h3>Ohm’s law</h3>
            <div className="formula-box">I = V / R</div>
            <p className="subtitle">
              For an ohmic conductor at constant temperature, current is directly proportional to potential difference.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function SeriesParallelPage() {
  const [mode, setMode] = useState("parallel");
  const [supplyVoltage, setSupplyVoltage] = useState(12);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(30);
  const [useThird, setUseThird] = useState(true);
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
    setMode("parallel");
    setSupplyVoltage(12);
    setR1(10);
    setR2(20);
    setR3(30);
    setUseThird(true);
    setStudentMode(false);
    setPredictionR("");
    setPredictionI("");
    setCheckResult(null);
  }

  function checkAnswers() {
    const predictedR = Number(predictionR);
    const predictedI = Number(predictionI);

    const rTolerance = Math.max(0.05, equivalentResistance * 0.02);
    const iTolerance = Math.max(0.01, totalCurrent * 0.02);

    setCheckResult({
      rCorrect: Math.abs(predictedR - equivalentResistance) <= rTolerance,
      iCorrect: Math.abs(predictedI - totalCurrent) <= iTolerance,
    });
  }

  const hidden = studentMode ? "?" : null;

  return (
    <>
      <section>
        <div className="card">
          <div className="card-content">
            <div className="studio-top">
              <div>
                <h2 className="studio-title">
                  {mode === "series" ? "Series Resistors Tester" : "Parallel Resistors Tester"}
                </h2>
                <p className="subtitle">
                  Compare equivalent resistance, total current, branch current, voltage, and power.
                </p>
              </div>

              <div className="prompt-box">
                <strong>Predict first:</strong>
                <br />
                In {mode}, does adding another resistor make the total resistance larger or smaller?
              </div>
            </div>

            <div className="mode-buttons">
              <button className={mode === "series" ? "mode-button active" : "mode-button"} onClick={() => setMode("series")}>
                Series
              </button>
              <button className={mode === "parallel" ? "mode-button active" : "mode-button"} onClick={() => setMode("parallel")}>
                Parallel
              </button>
            </div>

            <div className="simulation">
              {mode === "series" ? (
                <SeriesDiagram supplyVoltage={supplyVoltage} resistors={resistors} totalCurrent={totalCurrent} />
              ) : (
                <ParallelDiagram supplyVoltage={supplyVoltage} resistors={resistors} rows={rows} totalCurrent={totalCurrent} />
              )}
            </div>

            <div className="summary-grid">
              <ValueBox label="Equivalent resistance" value={hidden ?? equivalentResistance.toFixed(2)} unit="Ω" />
              <ValueBox label="Total current" value={hidden ?? totalCurrent.toFixed(2)} unit="A" />
              <ValueBox label="Total power" value={hidden ?? totalPower.toFixed(2)} unit="W" />
            </div>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <h3>Live resistor data</h3>
            <p className="subtitle">
              In parallel, the table shows the current measured in each branch.
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
            <div className="small-title">CONTROLS</div>

            <div className="control-group">
              <div className="control-label">
                <span>Supply voltage</span>
                <strong>{supplyVoltage.toFixed(1)} V</strong>
              </div>
              <input type="range" min="1" max="24" step="0.5" value={supplyVoltage} onChange={(e) => setSupplyVoltage(Number(e.target.value))} />
            </div>

            <ResistanceSlider label="R1" value={r1} setValue={setR1} />
            <ResistanceSlider label="R2" value={r2} setValue={setR2} />

            {useThird && <ResistanceSlider label="R3" value={r3} setValue={setR3} />}

            <label className="switch-row">
              Use third resistor
              <input type="checkbox" checked={useThird} onChange={(e) => setUseThird(e.target.checked)} />
            </label>

            <label className="switch-row">
              Student mode
              <input type="checkbox" checked={studentMode} onChange={(e) => setStudentMode(e.target.checked)} />
            </label>

            <button className="button-light full" onClick={reset}>↺ Reset</button>
          </div>
        </div>

        <br />

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
                  Current is the same through every resistor. Voltage is shared between resistors.
                </p>
              </>
            ) : (
              <>
                <h3>Parallel</h3>
                <div className="formula-box">
                  1/R<sub>total</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + 1/R<sub>3</sub>
                </div>
                <p className="subtitle">
                  Voltage is the same across every branch. Total current is the sum of the branch currents.
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
                <input type="number" value={predictionR} onChange={(e) => setPredictionR(e.target.value)} placeholder="e.g. 6.67" />
              </div>

              <div>
                <p className="subtitle">Predicted Itotal / A</p>
                <input type="number" value={predictionI} onChange={(e) => setPredictionI(e.target.value)} placeholder="e.g. 1.80" />
              </div>
            </div>

            <button className="button-dark full" onClick={checkAnswers}>
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
      </aside>
    </>
  );
}

function ResistanceSlider({ label, value, setValue }) {
  return (
    <div className="control-group">
      <div className="control-label">
        <span>{label}</span>
        <strong>{value.toFixed(1)} Ω</strong>
      </div>
      <input type="range" min="1" max="100" step="1" value={value} onChange={(e) => setValue(Number(e.target.value))} />
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

      <text x="535" y="340" fill="#6f624d" fontSize="14">
        Same current everywhere: I = {totalCurrent.toFixed(2)} A
      </text>
    </svg>
  );
}

function ParallelDiagram({ supplyVoltage, resistors, rows, totalCurrent }) {
  const branchPositions = resistors.length === 3 ? [330, 500, 670] : [410, 610];
  const railEnd = branchPositions[branchPositions.length - 1];

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

      {/* Cell */}
      <line x1="105" y1="120" x2="165" y2="120" stroke="#30271e" strokeWidth="7" strokeLinecap="round" />
      <line x1="118" y1="168" x2="152" y2="168" stroke="#30271e" strokeWidth="5" strokeLinecap="round" />
      <text x="173" y="124" fill="#30271e" fontSize="16" fontWeight="800">+</text>
      <text x="163" y="174" fill="#30271e" fontSize="16" fontWeight="800">−</text>

      {/* Main circuit path. Ammeter is in series before the branches. */}
      <path d="M135 120 V90 H190" fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      <line x1="190" y1="90" x2="213" y2="90" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
      <circle cx="240" cy="90" r="27" fill="#fff" stroke="#30271e" strokeWidth="4" />
      <text x="240" y="99" textAnchor="middle" fill="#30271e" fontSize="26" fontWeight="900">A</text>
      <line x1="267" y1="90" x2={railEnd} y2="90" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      <text x="204" y="130" fill="#6f624d" fontSize="13">
        Itotal = {totalCurrent.toFixed(2)} A
      </text>

      {/* Bottom return rail, ending at the final branch. No excess wire on the right. */}
      <path d={`M135 168 V300 H${railEnd}`} fill="none" stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

      {/* Parallel branches. Resistor rectangles are vertical because the branch wire is vertical. */}
      {branchPositions.map((x, index) => (
        <g key={index}>
          {/* Bright branch current label, placed above the rail so it is not hidden. */}
          <text
            x={x}
            y="58"
            textAnchor="middle"
            fill="#ffd84d"
            stroke="#30271e"
            strokeWidth="3"
            paintOrder="stroke fill"
            fontSize="14"
            fontWeight="900"
          >
            I{index + 1} = {rows[index].current.toFixed(2)} A
          </text>

          <path d={`M${x} 90 V121`} stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

          <circle cx={x} cy="146" r="23" fill="#fff" stroke="#30271e" strokeWidth="4" />
          <text x={x} y="154" textAnchor="middle" fill="#30271e" fontSize="23" fontWeight="900">A</text>

          <path d={`M${x} 169 V190`} stroke="#30271e" strokeWidth="8" strokeLinecap="round" />

          <rect x={x - 27} y="190" width="54" height="88" rx="10" fill="#fff" stroke="#30271e" strokeWidth="4" />
          <text x={x} y="228" textAnchor="middle" fill="#30271e" fontSize="14" fontWeight="900">
            R{index + 1}
          </text>
          <text x={x} y="248" textAnchor="middle" fill="#30271e" fontSize="12" fontWeight="800">
            {resistors[index].toFixed(1)} Ω
          </text>

          <path d={`M${x} 278 V300`} stroke="#30271e" strokeWidth="8" strokeLinecap="round" />
        </g>
      ))}

      {/* Current direction arrows */}
      <path d="M170 90 H205" stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowParallel)" />
      <path d={`M285 90 H${branchPositions[0] - 35}`} stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowParallel)" />
      <path d={`M${railEnd - 40} 300 H${railEnd - 100}`} stroke="#30271e" strokeWidth="3" markerEnd="url(#arrowParallel)" />

      <text x="445" y="340" textAnchor="middle" fill="#6f624d" fontSize="14">
        {resistors.length === 3
          ? "Branch currents add: Itotal = I1 + I2 + I3"
          : "Branch currents add: Itotal = I1 + I2"}
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

function ValueBox({ label, value, unit }) {
  return (
    <div className="value-box">
      <div className="value-label">{label}</div>
      <div className="value-number">{value}</div>
      <div className="value-unit">{unit}</div>
    </div>
  );
}

function StyleBlock() {
  return (
    <style>{`
      * { box-sizing: border-box; }

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
        line-height: 1.45;
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

      .full {
        width: 100%;
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
        width: 100%;
        display: block;
        text-align: left;
        padding: 12px;
        border-radius: 16px;
        margin-bottom: 9px;
        background: rgba(255,255,255,0.45);
        border: 1px solid transparent;
        color: #30271e;
      }

      .topic-button:hover {
        border-color: #a9c6d0;
      }

      .topic.active {
        background: #dbeaf0;
        border: 1px solid #a9c6d0;
      }

      .topic.muted {
        opacity: 0.65;
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
        margin: 14px 0 16px;
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

      .graph-area {
        margin-top: 10px;
        background: #f8f4e8;
        border: 1px solid #e1d7bf;
        border-radius: 20px;
        overflow: hidden;
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
  );
}
