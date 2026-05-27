import { useMemo, useRef, useState } from "react";

const topics = [
  { key: "ohms-law", title: "Ohm’s Law", subtitle: "V, I and R" },
  { key: "series-parallel", title: "Series & Parallel", subtitle: "Resistor networks" },
  { key: "potential-divider", title: "Potential Dividers", subtitle: "Shared voltage" },
  { key: "wire-resistance", title: "Resistance of a Wire", subtitle: "R = ρL/A" },
];

const predictionSets = {
  "ohms-law": [
    {
      question: "If resistance doubles while voltage stays the same, what happens to current?",
      options: ["It halves", "It doubles", "It stays the same"],
      answer: 0,
    },
    {
      question: "If voltage increases and resistance is fixed, what happens to current?",
      options: ["It increases", "It decreases", "It becomes zero"],
      answer: 0,
    },
    {
      question: "For a fixed resistor, what graph shape should I against V have?",
      options: ["A straight line", "A curve flattening out", "A horizontal line"],
      answer: 0,
    },
    {
      question: "If current increases, what happens to power at the same voltage?",
      options: ["Power increases", "Power decreases", "Power is unchanged"],
      answer: 0,
    },
    {
      question: "Which equation matches Ohm’s law?",
      options: ["I = V / R", "I = R / V", "I = V × R"],
      answer: 0,
    },
  ],
  "series-parallel": [
    {
      question: "In series, adding another resistor makes total resistance...",
      options: ["Larger", "Smaller", "Unchanged"],
      answer: 0,
    },
    {
      question: "In parallel, adding another branch makes total resistance...",
      options: ["Smaller", "Larger", "Unchanged"],
      answer: 0,
    },
    {
      question: "In a series circuit, the current through each resistor is...",
      options: ["The same", "Different in each resistor", "Always zero"],
      answer: 0,
    },
    {
      question: "In a parallel circuit, the potential difference across each branch is...",
      options: ["The same", "Shared unevenly", "Always half the supply"],
      answer: 0,
    },
    {
      question: "In parallel, total current is...",
      options: ["The sum of branch currents", "Less than every branch current", "Always 1 A"],
      answer: 0,
    },
  ],
  "potential-divider": [
    {
      question: "If R2 gets larger while R1 stays fixed, V2 becomes...",
      options: ["Larger", "Smaller", "Unchanged"],
      answer: 0,
    },
    {
      question: "In a two-resistor divider, Vs is equal to...",
      options: ["V1 + V2", "V1 − V2", "V1 × V2"],
      answer: 0,
    },
    {
      question: "If R1 and R2 are equal, V1 and V2 are...",
      options: ["Equal", "Always zero", "Unrelated"],
      answer: 0,
    },
    {
      question: "The same series current flows through...",
      options: ["R1 and R2", "Only R1", "Only R2"],
      answer: 0,
    },
    {
      question: "If supply voltage doubles and resistors stay fixed, V2...",
      options: ["Doubles", "Halves", "Stays the same"],
      answer: 0,
    },
  ],
  "wire-resistance": [
    {
      question: "If wire length doubles, resistance should...",
      options: ["Double", "Halve", "Stay the same"],
      answer: 0,
    },
    {
      question: "If wire diameter increases, resistance should...",
      options: ["Decrease", "Increase", "Stay fixed"],
      answer: 0,
    },
    {
      question: "A material with higher resistivity gives...",
      options: ["Higher resistance", "Lower resistance", "No change"],
      answer: 0,
    },
    {
      question: "In R = ρL/A, increasing cross-sectional area makes R...",
      options: ["Smaller", "Larger", "Negative"],
      answer: 0,
    },
    {
      question: "At fixed voltage, a larger wire resistance gives...",
      options: ["Less current", "More current", "The same current"],
      answer: 0,
    },
  ],
};

const ohmsRevealDefaults = {
  voltage: false,
  current: false,
  power: false,
  resistance: false,
};

const dividerRevealDefaults = {
  supplyVoltage: false,
  current: false,
  v1: false,
  v2: false,
  voltageSum: false,
};

const networkRevealDefaults = {
  supplyVoltage: false,
  equivalentResistance: false,
  totalCurrent: false,
  totalPower: false,
  branchCurrent0: false,
  branchCurrent1: false,
  branchCurrent2: false,
};

const wireRevealDefaults = {
  resistance: false,
  current: false,
  area: false,
  resistivity: false,
  length: false,
  diameter: false,
  voltage: false,
};

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
          <TopicSelector page={page} setPage={setPage} />
        </header>

        <main className="main-grid">
          {page === "ohms-law" && <OhmsLawPage />}
          {page === "series-parallel" && <SeriesParallelPage />}
          {page === "potential-divider" && <PotentialDividerPage />}
          {page === "wire-resistance" && <WireResistancePage />}
        </main>
      </div>
    </div>
  );
}

function TopicSelector({ page, setPage }) {
  const activeTopic = topics.find((topic) => topic.key === page) ?? topics[0];

  return (
    <div className="topic-panel">
      <label className="topic-select-label" htmlFor="topic-select">
        <span className="small-title">TOPIC</span>
        <strong>{activeTopic.subtitle}</strong>
      </label>
      <select
        id="topic-select"
        className="topic-select"
        value={page}
        onChange={(event) => setPage(event.target.value)}
      >
        {topics.map((topic) => (
          <option key={topic.key} value={topic.key}>
            {topic.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function OhmsLawPage() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(12);
  const [studentMode, setStudentMode] = useState(false);
  const [showElectrons, setShowElectrons] = useState(false);
  const [revealedValues, setRevealedValues] = useState(ohmsRevealDefaults);

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
    setRevealedValues(ohmsRevealDefaults);
  }

  function flipValue(key) {
    setRevealedValues((currentValues) => ({
      ...currentValues,
      [key]: !currentValues[key],
    }));
  }

  function toggleStudentMode(checked) {
    setStudentMode(checked);
    setRevealedValues(ohmsRevealDefaults);
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

            </div>

            <div className="simulation">
              <svg viewBox="0 0 850 390" width="100%" height="100%">
                <defs>
                  <marker id="arrowOhm" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#1f2433" />
                  </marker>

                  <path id="currentPathOhm" d="M150 120 V90 H350 M470 90 H720 V210 M720 265 V300 H150 V168" fill="none" />
                  <path id="electronPathOhm" d="M150 168 V300 H720 V265 M720 210 V90 H470 M350 90 H150 V120" fill="none" />
                </defs>

                <rect width="850" height="390" fill="#fffaf0" />

                <SvgInfoCard
                  x={188}
                  y={202}
                  width={132}
                  height={70}
                  label="Voltage"
                  value={voltage.toFixed(1)}
                  unit="V"
                  revealed={revealedValues.voltage}
                  onFlip={() => flipValue("voltage")}
                />

                <line x1="120" y1="120" x2="180" y2="120" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
                <line x1="133" y1="168" x2="167" y2="168" stroke="#1f2433" strokeWidth="5" strokeLinecap="round" />
                <text x="188" y="124" fill="#1f2433" fontSize="16" fontWeight="800">+</text>
                <text x="178" y="174" fill="#1f2433" fontSize="16" fontWeight="800">−</text>

                <path d="M150 120 V90 H350" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
                <path d="M470 90 H720 V210" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
                <path d="M720 265 V300 H150 V168" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

                <rect x="350" y="66" width="120" height="48" rx="10" fill="#fff" stroke="#1f2433" strokeWidth="4" />
                <SvgInfoCard
                  x={506}
                  y={120}
                  width={132}
                  height={66}
                  label="Resistance"
                  value={resistance.toFixed(1)}
                  unit="Ω"
                  revealed={revealedValues.resistance}
                  onFlip={() => flipValue("resistance")}
                  compact
                />

                <path d="M350 90 V160 H382" fill="none" stroke="#83919a" strokeWidth="3" strokeDasharray="5 5" />
                <path d="M470 90 V160 H438" fill="none" stroke="#83919a" strokeWidth="3" strokeDasharray="5 5" />
                <circle cx="410" cy="160" r="26" fill="#fff" stroke="#1f2433" strokeWidth="4" />
                <text x="410" y="169" textAnchor="middle" fill="#1f2433" fontSize="26" fontWeight="900">V</text>
                <SvgInfoCard
                  x={342}
                  y={184}
                  width={136}
                  height={70}
                  label="Voltmeter"
                  value={voltage.toFixed(1)}
                  unit="V"
                  revealed={revealedValues.voltage}
                  onFlip={() => flipValue("voltage")}
                  compact
                />

                <line x1="720" y1="210" x2="720" y2="221" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
                <circle cx="720" cy="243" r="26" fill="#fff" stroke="#1f2433" strokeWidth="4" />
                <text x="720" y="252" textAnchor="middle" fill="#1f2433" fontSize="26" fontWeight="900">A</text>
                <line x1="720" y1="265" x2="720" y2="276" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
                <SvgInfoCard
                  x={560}
                  y={210}
                  width={132}
                  height={70}
                  label="Current"
                  value={current.toFixed(2)}
                  unit="A"
                  revealed={revealedValues.current}
                  onFlip={() => flipValue("current")}
                  compact
                />

                <path d="M225 90 H305" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowOhm)" />
                <path d="M720 130 V190" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowOhm)" />
                <path d="M610 300 H550" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowOhm)" />

                <text x="520" y="76" fill="#1f2433" fontSize="13" fontWeight="700">
                  conventional current
                </text>

                {[0, 1, 2, 3, 4].map((n) => (
                  <circle key={`current-${n}`} r="7" fill="#17a9c4">
                    <animateMotion dur={`${speed}s`} repeatCount="indefinite" begin={`${n * 0.55}s`}>
                      <mpath href="#currentPathOhm" />
                    </animateMotion>
                  </circle>
                ))}

                {showElectrons &&
                  [0, 1, 2, 3].map((n) => (
                    <circle key={`electron-${n}`} r="5" fill="#7c5cff">
                      <animateMotion dur={`${speed + 1}s`} repeatCount="indefinite" begin={`${n * 0.65}s`}>
                        <mpath href="#electronPathOhm" />
                      </animateMotion>
                    </circle>
                  ))}
              </svg>
            </div>

            <div className="summary-grid">
              <FlipValueBox label="Current" value={current.toFixed(2)} unit="A" revealed={revealedValues.current} onFlip={() => flipValue("current")} />
              <FlipValueBox label="Power" value={power.toFixed(2)} unit="W" revealed={revealedValues.power} onFlip={() => flipValue("power")} />
              <FlipValueBox label="Resistance" value={resistance.toFixed(1)} unit="Ω" revealed={revealedValues.resistance} onFlip={() => flipValue("resistance")} />
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
                <rect width="520" height="290" fill="#fffaf0" />

                <line x1="50" y1="250" x2="490" y2="250" stroke="#1f2433" strokeWidth="3" />
                <line x1="50" y1="250" x2="50" y2="35" stroke="#1f2433" strokeWidth="3" />

                <text x="260" y="282" textAnchor="middle" fill="#1f2433" fontSize="12">
                  Potential difference V / V
                </text>

                <text x="13" y="145" textAnchor="middle" fill="#1f2433" fontSize="12" transform="rotate(-90 13 145)">
                  Current I / A
                </text>

                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <g key={n}>
                    <line x1={50 + n * 70} y1="250" x2={50 + n * 70} y2="255" stroke="#1f2433" />
                    <text x={50 + n * 70} y="270" textAnchor="middle" fill="#5e6b73" fontSize="10">
                      {n * 2}
                    </text>
                  </g>
                ))}

                <path d={graphPath} fill="none" stroke="#17a9c4" strokeWidth="5" strokeLinecap="round" />

                {graphPoints.map((p, index) => (
                  <circle key={index} cx={p.x} cy={p.y} r="5" fill="#1f2433" />
                ))}

                <circle cx={activePoint.x} cy={activePoint.y} r="9" fill="#f25f4c" />
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
              <input type="checkbox" checked={studentMode} onChange={(e) => toggleStudentMode(e.target.checked)} />
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
            <PredictionQuiz topic="ohms-law" />
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

function PotentialDividerPage() {
  const [supplyVoltage, setSupplyVoltage] = useState(9);
  const [rTop, setRTop] = useState(3000);
  const [rBottom, setRBottom] = useState(6000);
  const [studentMode, setStudentMode] = useState(false);
  const [revealedValues, setRevealedValues] = useState(dividerRevealDefaults);
  const [prediction, setPrediction] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  const totalResistance = rTop + rBottom;
  const circuitCurrent = supplyVoltage / totalResistance;
  const v1 = circuitCurrent * rTop;
  const v2 = circuitCurrent * rBottom;
  const voltageSum = v1 + v2;
  const v1Ratio = rTop / totalResistance;
  const v2Ratio = rBottom / totalResistance;

  const v1Segments = useVoltageGraphPoints(v1Ratio);
  const v2Segments = useVoltageGraphPoints(v2Ratio);

  function reset() {
    setSupplyVoltage(9);
    setRTop(3000);
    setRBottom(6000);
    setStudentMode(false);
    setRevealedValues(dividerRevealDefaults);
    setPrediction("");
    setCheckResult(null);
  }

  function flipValue(key) {
    setRevealedValues((currentValues) => ({
      ...currentValues,
      [key]: !currentValues[key],
    }));
  }

  function toggleStudentMode(checked) {
    setStudentMode(checked);
    setRevealedValues(dividerRevealDefaults);
  }

  function checkAnswer() {
    const predictedVoltage = Number(prediction);
    const tolerance = Math.max(0.05, v2 * 0.025);

    setCheckResult({
      correct: Math.abs(predictedVoltage - v2) <= tolerance,
    });
  }

  return (
    <>
      <section>
        <div className="card">
          <div className="card-content">
            <div className="studio-top">
              <div>
                <h2 className="studio-title">Potential Divider</h2>
                <p className="subtitle">
                  Watch one series current create separate potential differences across R1 and R2.
                </p>
              </div>

            </div>

            <div className="simulation">
              <PotentialDividerDiagram
                supplyVoltage={supplyVoltage}
                rTop={rTop}
                rBottom={rBottom}
                v1={v1}
                v2={v2}
                circuitCurrent={circuitCurrent}
                revealedValues={revealedValues}
                onFlip={flipValue}
              />
            </div>

            <div className="summary-grid five">
              <FlipValueBox label="Supply voltage" value={supplyVoltage.toFixed(2)} unit="V" revealed={revealedValues.supplyVoltage} onFlip={() => flipValue("supplyVoltage")} />
              <FlipValueBox label="Circuit current" value={(circuitCurrent * 1000).toFixed(2)} unit="mA" revealed={revealedValues.current} onFlip={() => flipValue("current")} />
              <FlipValueBox label="V1 across R1" value={v1.toFixed(2)} unit="V" revealed={revealedValues.v1} onFlip={() => flipValue("v1")} />
              <FlipValueBox label="V2 across R2" value={v2.toFixed(2)} unit="V" revealed={revealedValues.v2} onFlip={() => flipValue("v2")} />
              <FlipValueBox label="V1 + V2" value={voltageSum.toFixed(2)} unit="V" revealed={revealedValues.voltageSum} onFlip={() => flipValue("voltageSum")} />
            </div>

          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <h3>Live graphs: component voltage against supply voltage</h3>
            <p className="subtitle">
              Each line changes slope when R1 or R2 changes because the supply voltage is shared in proportion to resistance.
            </p>

            <div className="split-graphs">
              <VoltageShareGraph
                title="V1 against supply voltage"
                yLabel="V1 / V"
                ratio={v1Ratio}
                supplyVoltage={supplyVoltage}
                points={v1Segments}
                color="#17a9c4"
              />
              <VoltageShareGraph
                title="V2 against supply voltage"
                yLabel="V2 / V"
                ratio={v2Ratio}
                supplyVoltage={supplyVoltage}
                points={v2Segments}
                color="#f25f4c"
              />
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
                <span>Supply voltage</span>
                <strong>{supplyVoltage.toFixed(1)} V</strong>
              </div>
              <input type="range" min="3" max="15" step="0.5" value={supplyVoltage} onChange={(event) => setSupplyVoltage(Number(event.target.value))} />
            </div>

            <KiloOhmSlider label="R1 upper" value={rTop} setValue={setRTop} />
            <KiloOhmSlider label="R2 lower" value={rBottom} setValue={setRBottom} />

            <label className="switch-row">
              Student mode
              <input type="checkbox" checked={studentMode} onChange={(event) => toggleStudentMode(event.target.checked)} />
            </label>

            <button className="button-light full" onClick={reset}>↺ Reset</button>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <PredictionQuiz topic="potential-divider" />
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <div className="small-title">RULE</div>
            <h3>Potential divider</h3>
            <div className="formula-box">
              V<sub>s</sub> = V<sub>1</sub> + V<sub>2</sub> + V<sub>3</sub>...
            </div>
            <p className="subtitle">
              In a series circuit, the supply potential difference is shared across the components.
            </p>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <div className="small-title">STUDENT TESTER</div>

            <div className="task-box">
              Predict V2 across R2, then check your answer.
            </div>

            <div className="check-grid single">
              <div>
                <p className="subtitle">Predicted V2 / V</p>
                <input type="number" value={prediction} onChange={(event) => setPrediction(event.target.value)} placeholder="e.g. 6.00" />
              </div>
            </div>

            <button className="button-dark full" onClick={checkAnswer}>
              Check prediction
            </button>

            {checkResult && (
              <div className="feedback">
                V2 across R2:{" "}
                <span className={checkResult.correct ? "good" : "bad"}>
                  {checkResult.correct ? "correct" : "check again"}
                </span>

                {!studentMode && (
                  <p className="subtitle">
                    Correct value: V2 = {v2.toFixed(2)} V
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

const wireMaterials = [
  { key: "copper", name: "Copper", resistivity: 1.68e-8, color: "#f25f4c" },
  { key: "constantan", name: "Constantan", resistivity: 4.9e-7, color: "#17a9c4" },
  { key: "nichrome", name: "Nichrome", resistivity: 1.1e-6, color: "#7c5cff" },
  { key: "steel", name: "Steel", resistivity: 1.4e-7, color: "#5e6b73" },
];

function randomWireDiameter() {
  return Number((0.32 + Math.random() * 0.54).toFixed(3));
}

function getAmmeterMax(current) {
  return current > 5 ? 10 : 5;
}

function getMeterNeedleAngle(current, maxCurrent) {
  const startAngle = 215;
  const endAngle = 325;
  const fraction = Math.min(Math.max(current / maxCurrent, 0), 1);
  return startAngle + fraction * (endAngle - startAngle);
}

function getInstrumentNeedleAngle(value, maxValue) {
  const startAngle = 215;
  const endAngle = 325;
  const fraction = Math.min(Math.max(value / maxValue, 0), 1);
  return startAngle + fraction * (endAngle - startAngle);
}

function WireResistancePage() {
  const [length, setLength] = useState(1.2);
  const [diameter, setDiameter] = useState(randomWireDiameter);
  const [materialKey, setMaterialKey] = useState("constantan");
  const [testVoltage, setTestVoltage] = useState(9);
  const [revealedValues, setRevealedValues] = useState(wireRevealDefaults);
  const [prediction, setPrediction] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [showDiameterView, setShowDiameterView] = useState(false);
  const [showCurrentMeter, setShowCurrentMeter] = useState(false);
  const [showVoltageMeter, setShowVoltageMeter] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);

  const material = wireMaterials.find((item) => item.key === materialKey) ?? wireMaterials[1];
  const area = Math.PI * ((diameter / 1000) / 2) ** 2;
  const resistance = material.resistivity * length / area;
  const current = testVoltage / resistance;
  const areaMm2 = area * 1_000_000;
  const resistivityScale = material.resistivity / 1e-8;
  const wireGraphMax = 100;
  const wireGraphBottom = 428;
  const wireGraphHeight = 360;

  const lengthGraphPoints = useMemo(() => {
    return Array.from({ length: 25 }, (_, index) => {
      const sampleLength = 0.25 + (index / 24) * 5.75;
      const sampleResistance = material.resistivity * sampleLength / area;
      return {
        x: 48 + (index / 24) * 418,
        y: wireGraphBottom - Math.min(sampleResistance / wireGraphMax, 1) * wireGraphHeight,
      };
    });
  }, [area, material.resistivity]);

  const diameterGraphPoints = useMemo(() => {
    return Array.from({ length: 21 }, (_, index) => {
      const sampleDiameter = 0.2 + index * 0.05;
      const sampleArea = Math.PI * ((sampleDiameter / 1000) / 2) ** 2;
      const sampleResistance = material.resistivity * length / sampleArea;

      return {
        x: 48 + (index / 20) * 418,
        y: wireGraphBottom - Math.min(sampleResistance / wireGraphMax, 1) * wireGraphHeight,
      };
    });
  }, [length, material.resistivity]);

  function flipValue(key) {
    setRevealedValues((currentValues) => ({
      ...currentValues,
      [key]: !currentValues[key],
    }));
  }

  function reset() {
    setLength(1.2);
    setDiameter(randomWireDiameter());
    setMaterialKey("constantan");
    setTestVoltage(9);
    setRevealedValues(wireRevealDefaults);
    setPrediction("");
    setCheckResult(null);
    setShowDiameterView(false);
    setShowCurrentMeter(false);
    setShowVoltageMeter(false);
    setTeacherMode(false);
  }

  function checkAnswer() {
    const predictedResistance = Number(prediction);
    const tolerance = Math.max(0.05, resistance * 0.03);

    setCheckResult({
      correct: Math.abs(predictedResistance - resistance) <= tolerance,
    });
  }

  return (
    <>
      <section>
        <div className="card">
          <div className="card-content">
            <div className="studio-top">
              <div>
                <h2 className="studio-title">Resistance of a Wire</h2>
                <p className="subtitle">
                  Change the wire and see why longer, thinner, higher-resistivity wires have more resistance.
                </p>
              </div>

            </div>

            <div className="simulation wire-simulation">
              <WireResistanceDiagram
                length={length}
                setLength={setLength}
                diameter={diameter}
                material={material}
                resistance={resistance}
                current={current}
                testVoltage={testVoltage}
                revealedValues={revealedValues}
                onFlip={flipValue}
                onShowCurrentMeter={() => {
                  setShowDiameterView(false);
                  setShowVoltageMeter(false);
                  setShowCurrentMeter(true);
                }}
                onShowVoltageMeter={() => {
                  setShowDiameterView(false);
                  setShowCurrentMeter(false);
                  setShowVoltageMeter(true);
                }}
                teacherMode={teacherMode}
              />
            </div>

            {showDiameterView && (
              <DiameterMeasureOverlay
                diameter={diameter}
                onClose={() => setShowDiameterView(false)}
              />
            )}

            {showCurrentMeter && (
              <CurrentMeterOverlay
                current={current}
                onClose={() => setShowCurrentMeter(false)}
              />
            )}

            {showVoltageMeter && (
              <VoltageMeterOverlay
                voltage={testVoltage}
                onClose={() => setShowVoltageMeter(false)}
              />
            )}

            {teacherMode && (
              <div className="summary-grid four">
                <FlipValueBox
                  label="Resistance"
                  value={resistance.toFixed(2)}
                  unit="Ω"
                  revealed={revealedValues.resistance}
                  onFlip={() => flipValue("resistance")}
                />
                <FlipValueBox
                  label="Current"
                  value={(current * 1000).toFixed(1)}
                  unit="mA"
                  revealed={revealedValues.current}
                  onFlip={() => flipValue("current")}
                />
                <FlipValueBox
                  label="Area"
                  value={areaMm2.toFixed(3)}
                  unit="mm²"
                  revealed={revealedValues.area}
                  onFlip={() => flipValue("area")}
                />
                <FlipValueBox
                  label="Resistivity"
                  value={resistivityScale.toFixed(1)}
                  unit="×10⁻⁸ Ωm"
                  revealed={revealedValues.resistivity}
                  onFlip={() => flipValue("resistivity")}
                />
              </div>
            )}

          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <h3>Live graphs: what changes the resistance?</h3>
            <p className="subtitle">
              The y-axis stays fixed so the line itself shows how length and diameter change resistance.
            </p>

            <div className="wire-graphs">
              <WireLineGraph
                title="R against length"
                xLabel="Length / m"
                yMax={wireGraphMax}
                points={lengthGraphPoints}
                activeX={48 + ((length - 0.25) / 5.75) * 418}
                activeY={wireGraphBottom - Math.min(resistance / wireGraphMax, 1) * wireGraphHeight}
                color={material.color}
                xTick={(n) => (n * 1.2).toFixed(1)}
              />
              <WireLineGraph
                title="R against diameter"
                xLabel="Diameter / mm"
                yMax={wireGraphMax}
                points={diameterGraphPoints}
                activeX={48 + ((diameter - 0.2) / 1.0) * 418}
                activeY={wireGraphBottom - Math.min(resistance / wireGraphMax, 1) * wireGraphHeight}
                color="#17a9c4"
                xTick={(n) => (0.2 + n * 0.2).toFixed(1)}
              />
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
                <span>Material</span>
                <strong>{material.name}</strong>
              </div>
              <select value={materialKey} onChange={(event) => setMaterialKey(event.target.value)}>
                {wireMaterials.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <div className="control-label">
                <span>Red clip length</span>
                <strong>read ruler</strong>
              </div>
              <input type="range" min="0.25" max="6" step="0.001" value={length} onChange={(event) => setLength(Number(event.target.value))} />
            </div>

            <div className="control-group">
              <div className="control-label">
                <span>Wire diameter</span>
                <strong>estimate from grid</strong>
              </div>
              <input type="range" min="0.2" max="1.2" step="0.001" value={diameter} onChange={(event) => setDiameter(Number(event.target.value))} />
            </div>

            {!showDiameterView && (
              <button
                className="button-light full"
                onClick={() => {
                  setShowCurrentMeter(false);
                  setShowVoltageMeter(false);
                  setShowDiameterView(true);
                }}
              >
                Show diameter grid
              </button>
            )}

            {!showCurrentMeter && (
              <button
                className="button-light full"
                onClick={() => {
                  setShowDiameterView(false);
                  setShowVoltageMeter(false);
                  setShowCurrentMeter(true);
                }}
              >
                Show current meter
              </button>
            )}

            {!showVoltageMeter && (
              <button
                className="button-light full"
                onClick={() => {
                  setShowDiameterView(false);
                  setShowCurrentMeter(false);
                  setShowVoltageMeter(true);
                }}
              >
                Show voltmeter
              </button>
            )}

            <div className="control-group">
              <div className="control-label">
                <span>Test voltage</span>
                <strong>{testVoltage.toFixed(1)} V</strong>
              </div>
              <input type="range" min="1" max="12" step="0.5" value={testVoltage} onChange={(event) => setTestVoltage(Number(event.target.value))} />
            </div>

            <button className="button-light full" onClick={reset}>↺ Reset</button>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <PredictionQuiz topic="wire-resistance" />
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <div className="small-title">RULE</div>
            <h3>Resistance of a wire</h3>
            <div className="formula-box">
              R = ρL / A
              <button
                className={revealedValues.resistance ? "formula-result flip-result revealed" : "formula-result flip-result"}
                onClick={() => flipValue("resistance")}
              >
                R = {revealedValues.resistance ? resistance.toFixed(2) : "?"} Ω
              </button>
            </div>
            <p className="subtitle">
              Resistance increases with length and resistivity, but decreases when cross-sectional area gets larger.
            </p>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <div className="small-title">STUDENT TESTER</div>

            <div className="task-box">
              Predict the wire resistance from its length, area, and material.
            </div>

            <div className="check-grid single">
              <div>
                <p className="subtitle">Predicted R / Ω</p>
                <input type="number" value={prediction} onChange={(event) => setPrediction(event.target.value)} placeholder="e.g. 3.70" />
              </div>
            </div>

            <button className="button-dark full" onClick={checkAnswer}>
              Check prediction
            </button>

            {checkResult && (
              <div className="feedback">
                Resistance:{" "}
                <span className={checkResult.correct ? "good" : "bad"}>
                  {checkResult.correct ? "correct" : "check again"}
                </span>

                <p className="subtitle">
                  Correct value: R = {resistance.toFixed(2)} Ω
                </p>
              </div>
            )}

            <button
              className={teacherMode ? "button-dark full teacher-mode-button" : "button-light full teacher-mode-button"}
              onClick={() => setTeacherMode((currentMode) => !currentMode)}
            >
              {teacherMode ? "Hide teacher values" : "Teacher mode"}
            </button>
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
  const [revealedValues, setRevealedValues] = useState(networkRevealDefaults);
  const [predictionR, setPredictionR] = useState("");
  const [predictionI, setPredictionI] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  const resistors = useMemo(() => (useThird ? [r1, r2, r3] : [r1, r2]), [r1, r2, r3, useThird]);

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
    setRevealedValues(networkRevealDefaults);
    setPredictionR("");
    setPredictionI("");
    setCheckResult(null);
  }

  function flipValue(key) {
    setRevealedValues((currentValues) => ({
      ...currentValues,
      [key]: !currentValues[key],
    }));
  }

  function toggleStudentMode(checked) {
    setStudentMode(checked);
    setRevealedValues(networkRevealDefaults);
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
                <SeriesDiagram resistors={resistors} totalCurrent={totalCurrent} revealedValues={revealedValues} onFlip={flipValue} />
              ) : (
                <ParallelDiagram supplyVoltage={supplyVoltage} resistors={resistors} rows={rows} totalCurrent={totalCurrent} revealedValues={revealedValues} onFlip={flipValue} />
              )}
            </div>

            <div className="summary-grid four">
              <FlipValueBox label="Supply voltage" value={supplyVoltage.toFixed(1)} unit="V" revealed={revealedValues.supplyVoltage} onFlip={() => flipValue("supplyVoltage")} />
              <FlipValueBox label="Equivalent resistance" value={equivalentResistance.toFixed(2)} unit="Ω" revealed={revealedValues.equivalentResistance} onFlip={() => flipValue("equivalentResistance")} />
              <FlipValueBox label="Total current" value={totalCurrent.toFixed(2)} unit="A" revealed={revealedValues.totalCurrent} onFlip={() => flipValue("totalCurrent")} />
              <FlipValueBox label="Total power" value={totalPower.toFixed(2)} unit="W" revealed={revealedValues.totalPower} onFlip={() => flipValue("totalPower")} />
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
              <input type="checkbox" checked={studentMode} onChange={(e) => toggleStudentMode(e.target.checked)} />
            </label>

            <button className="button-light full" onClick={reset}>↺ Reset</button>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-content">
            <PredictionQuiz topic="series-parallel" />
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

function KiloOhmSlider({ label, value, setValue }) {
  return (
    <div className="control-group">
      <div className="control-label">
        <span>{label}</span>
        <strong>{(value / 1000).toFixed(1)} kΩ</strong>
      </div>
      <input type="range" min="1000" max="20000" step="500" value={value} onChange={(event) => setValue(Number(event.target.value))} />
    </div>
  );
}

function useVoltageGraphPoints(ratio) {
  return useMemo(() => {
    return Array.from({ length: 25 }, (_, index) => {
      const voltage = 3 + index * 0.5;
      const componentVoltage = voltage * ratio;

      return {
        x: 48 + (index / 24) * 418,
        y: 248 - (componentVoltage / 15) * 188,
      };
    });
  }, [ratio]);
}

function VoltageShareGraph({ title, yLabel, ratio, supplyVoltage, points, color }) {
  const graphPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const activePoint = {
    x: 48 + ((supplyVoltage - 3) / 12) * 418,
    y: 248 - ((supplyVoltage * ratio) / 15) * 188,
  };

  return (
    <div className="graph-area compact">
      <div className="graph-title">{title}</div>
      <svg viewBox="0 0 520 290" width="100%" height="250">
        <rect width="520" height="290" fill="#fffaf0" />

        <line x1="48" y1="248" x2="490" y2="248" stroke="#1f2433" strokeWidth="3" />
        <line x1="48" y1="248" x2="48" y2="35" stroke="#1f2433" strokeWidth="3" />

        {[0, 1, 2, 3, 4].map((n) => (
          <g key={n}>
            <line x1={48 + n * 104.5} y1="248" x2={48 + n * 104.5} y2="253" stroke="#1f2433" />
            <text x={48 + n * 104.5} y="270" textAnchor="middle" fill="#5e6b73" fontSize="10">
              {3 + n * 3}
            </text>
          </g>
        ))}

        {[0, 1, 2, 3, 4, 5].map((n) => (
          <g key={n}>
            <line x1="43" y1={248 - n * 37.6} x2="48" y2={248 - n * 37.6} stroke="#1f2433" />
            <text x="34" y={252 - n * 37.6} textAnchor="end" fill="#5e6b73" fontSize="10">
              {n * 3}
            </text>
          </g>
        ))}

        <text x="268" y="284" textAnchor="middle" fill="#1f2433" fontSize="12">
          Supply voltage / V
        </text>
        <text x="14" y="144" textAnchor="middle" fill="#1f2433" fontSize="12" transform="rotate(-90 14 144)">
          {yLabel}
        </text>

        <path d={graphPath} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <circle cx={activePoint.x} cy={activePoint.y} r="9" fill={color} stroke="#1f2433" strokeWidth="2" />
      </svg>
    </div>
  );
}

function WireLineGraph({ title, xLabel, yMax, points, activeX, activeY, color, xTick }) {
  const graphPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const graphBottom = 428;
  const graphHeight = 360;

  return (
    <div className="graph-area compact">
      <div className="graph-title">{title}</div>
      <svg viewBox="0 0 520 470" width="100%" height="430">
        <rect width="520" height="470" fill="#fffaf0" />
        <line x1="48" y1={graphBottom} x2="490" y2={graphBottom} stroke="#1f2433" strokeWidth="3" />
        <line x1="48" y1={graphBottom} x2="48" y2="52" stroke="#1f2433" strokeWidth="3" />

        {[0, 1, 2, 3, 4, 5].map((n) => (
          <g key={n}>
            <line x1={48 + n * 83.6} y1={graphBottom} x2={48 + n * 83.6} y2={graphBottom + 5} stroke="#1f2433" />
            <text x={48 + n * 83.6} y={graphBottom + 22} textAnchor="middle" fill="#5e6b73" fontSize="10">
              {xTick(n)}
            </text>
          </g>
        ))}

        {[0, 1, 2, 3, 4, 5].map((n) => (
          <g key={n}>
            <line x1="43" y1={graphBottom - n * (graphHeight / 5)} x2="48" y2={graphBottom - n * (graphHeight / 5)} stroke="#1f2433" />
            <text x="34" y={graphBottom + 4 - n * (graphHeight / 5)} textAnchor="end" fill="#5e6b73" fontSize="10">
              {(yMax / 5) * n}
            </text>
          </g>
        ))}

        <text x="268" y="462" textAnchor="middle" fill="#1f2433" fontSize="12">
          {xLabel}
        </text>
        <text x="14" y="240" textAnchor="middle" fill="#1f2433" fontSize="12" transform="rotate(-90 14 240)">
          R / Ω
        </text>

        <path d={graphPath} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <circle cx={activeX} cy={activeY} r="9" fill="#fff3b0" stroke="#1f2433" strokeWidth="3" />
      </svg>
    </div>
  );
}

function PotentialDividerDiagram({
  supplyVoltage,
  rTop,
  rBottom,
  v1,
  v2,
  circuitCurrent,
  revealedValues,
  onFlip,
}) {
  return (
    <svg viewBox="0 0 850 390" width="100%" height="100%">
      <defs>
        <marker id="arrowDivider" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#1f2433" />
        </marker>
      </defs>

      <rect width="850" height="390" fill="#fffaf0" />

      <line x1="105" y1="118" x2="165" y2="118" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
      <line x1="118" y1="166" x2="152" y2="166" stroke="#1f2433" strokeWidth="5" strokeLinecap="round" />
      <text x="173" y="122" fill="#1f2433" fontSize="16" fontWeight="800">+</text>
      <text x="163" y="172" fill="#1f2433" fontSize="16" fontWeight="800">−</text>

      <path d="M135 118 V90 H262" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <circle cx="292" cy="90" r="27" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="292" y="99" textAnchor="middle" fill="#1f2433" fontSize="26" fontWeight="900">A</text>
      <path d="M319 90 H420 V112" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <path d="M420 278 V300 H135 V166" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      <SvgInfoCard
        x={210}
        y={16}
        width={164}
        height={70}
        label="Current"
        value={(circuitCurrent * 1000).toFixed(2)}
        unit="mA"
        revealed={revealedValues.current}
        onFlip={() => onFlip("current")}
        compact
      />

      <rect x="377" y="112" width="86" height="70" rx="12" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="420" y="142" textAnchor="middle" fill="#1f2433" fontSize="15" fontWeight="900">R1</text>
      <text x="420" y="162" textAnchor="middle" fill="#1f2433" fontSize="12" fontWeight="800">
        {(rTop / 1000).toFixed(1)} kΩ
      </text>

      <circle cx="420" cy="205" r="9" fill="#f25f4c" stroke="#1f2433" strokeWidth="3" />
      <path d="M420 182 V196" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <path d="M420 214 V222" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      <rect x="377" y="222" width="86" height="56" rx="12" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="420" y="245" textAnchor="middle" fill="#1f2433" fontSize="15" fontWeight="900">R2</text>
      <text x="420" y="264" textAnchor="middle" fill="#1f2433" fontSize="12" fontWeight="800">
        {(rBottom / 1000).toFixed(1)} kΩ
      </text>

      <path d="M61 132 H96 V118 H105" fill="none" stroke="#17a9c4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M61 152 H96 V166 H118" fill="none" stroke="#17a9c4" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="36" cy="142" r="28" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="36" y="151" textAnchor="middle" fill="#1f2433" fontSize="22" fontWeight="900">Vs</text>
      <SvgInfoCard
        x={54}
        y={184}
        width={130}
        height={66}
        label="Supply"
        value={supplyVoltage.toFixed(2)}
        unit="V"
        revealed={revealedValues.supplyVoltage}
        onFlip={() => onFlip("supplyVoltage")}
        compact
      />

      <path d="M470 112 H542 V147 H562" fill="none" stroke="#17a9c4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M470 182 H642 V147 H618" fill="none" stroke="#17a9c4" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="590" cy="147" r="28" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="590" y="156" textAnchor="middle" fill="#1f2433" fontSize="24" fontWeight="900">V1</text>
      <SvgInfoCard
        x={526}
        y={178}
        width={130}
        height={66}
        label="V1"
        value={v1.toFixed(2)}
        unit="V"
        revealed={revealedValues.v1}
        onFlip={() => onFlip("v1")}
        compact
      />

      <path d="M470 222 H542 V250 H562" fill="none" stroke="#f25f4c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M470 278 H642 V250 H618" fill="none" stroke="#f25f4c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="590" cy="250" r="28" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="590" y="259" textAnchor="middle" fill="#1f2433" fontSize="24" fontWeight="900">V2</text>
      <SvgInfoCard
        x={526}
        y={282}
        width={130}
        height={66}
        label="V2"
        value={v2.toFixed(2)}
        unit="V"
        revealed={revealedValues.v2}
        onFlip={() => onFlip("v2")}
        compact
      />

      <path d="M198 90 H248" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowDivider)" />
      <path d="M332 90 H382" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowDivider)" />
      <path d="M420 98 V109" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowDivider)" />
      <path d="M420 288 V296" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowDivider)" />

      <SvgInfoCard
        x={632}
        y={52}
        width={160}
        height={78}
        label="V1 + V2"
        value={(v1 + v2).toFixed(2)}
        unit="V"
        revealed={revealedValues.voltageSum}
        onFlip={() => onFlip("voltageSum")}
      />
    </svg>
  );
}

function WireResistanceDiagram({
  length,
  setLength,
  diameter,
  material,
  resistance,
  current,
  testVoltage,
  revealedValues,
  onFlip,
  onShowCurrentMeter,
  onShowVoltageMeter,
  teacherMode,
}) {
  const svgRef = useRef(null);
  const draggingClip = useRef(false);
  const rulerX = 66;
  const rulerZeroX = 88;
  const rulerY = 34;
  const rulerScaleWidth = 680;
  const rulerWidth = rulerScaleWidth + (rulerZeroX - rulerX);
  const wireY = 126;
  const wireEnd = rulerZeroX + rulerScaleWidth;
  const clipX = rulerZeroX + (length / 6) * rulerScaleWidth;
  const wireThickness = 4 + (diameter / 1.2) * 12;
  const currentA = current;
  const ammeterMax = getAmmeterMax(currentA);
  const smallMeterNeedleAngle = getMeterNeedleAngle(currentA, ammeterMax);
  const smallMeterCenterX = 178;
  const smallMeterCenterY = 318;
  const smallMeterNeedleX = smallMeterCenterX + Math.cos((smallMeterNeedleAngle * Math.PI) / 180) * 24;
  const smallMeterNeedleY = smallMeterCenterY + Math.sin((smallMeterNeedleAngle * Math.PI) / 180) * 24;

  function updateLengthFromPointer(event) {
    const svg = svgRef.current;
    if (!svg) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    const clampedX = Math.min(wireEnd, Math.max(rulerZeroX + 28, svgPoint.x));
    const nextLength = ((clampedX - rulerZeroX) / rulerScaleWidth) * 6;
    setLength(Number(nextLength.toFixed(3)));
  }

  function startDrag(event) {
    draggingClip.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateLengthFromPointer(event);
  }

  function moveDrag(event) {
    if (!draggingClip.current) return;
    updateLengthFromPointer(event);
  }

  function endDrag() {
    draggingClip.current = false;
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 850 390"
      width="100%"
      height="100%"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <defs>
        <marker id="arrowWire" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#1f2433" />
        </marker>
      </defs>

      <rect width="850" height="390" fill="#fffaf0" />

      <text x="78" y="24" fill="#1f2433" fontSize="15" fontWeight="800">
        {material.name} wire
      </text>

      <rect x={rulerX} y={rulerY} width={rulerWidth} height="72" fill="#ffd89a" stroke="#1f2433" strokeWidth="3" />
      {Array.from({ length: 61 }, (_, index) => {
        const x = rulerZeroX + (index / 60) * rulerScaleWidth;
        const isMeter = index % 10 === 0;
        const isHalf = index % 5 === 0;
        return (
          <g key={index}>
            <line
              x1={x}
              y1={isMeter ? 70 : isHalf ? 79 : 88}
              x2={x}
              y2={106}
              stroke="#1f2433"
              strokeWidth={isMeter ? 3 : isHalf ? 2.4 : 1.8}
            />
            {isMeter && (
              <text x={x} y="61" textAnchor={index === 0 ? "start" : "middle"} fill="#1f2433" fontSize="20" fontWeight="900">
                {index === 60 ? "6 m" : index / 10}
              </text>
            )}
          </g>
        );
      })}

      <line x1={rulerZeroX} y1={wireY} x2={wireEnd} y2={wireY} stroke="#d9cdd5" strokeWidth="11" strokeLinecap="round" />
      <line x1={rulerZeroX} y1={wireY} x2={clipX} y2={wireY} stroke={material.color} strokeWidth={wireThickness} strokeLinecap="round" />
      <rect
        x={rulerX - 10}
        y={rulerY}
        width={rulerWidth + 20}
        height="112"
        fill="transparent"
        className="wire-drag-zone"
        onPointerDown={startDrag}
      />

      <g>
        <path d={`M${rulerZeroX} ${wireY} V318 H178`} fill="none" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
        <path d={`M${clipX} ${wireY} V198 H738 V318 H548`} fill="none" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
        <path d="M435 318 H178" fill="none" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
      </g>

      <g className="alligator fixed-clip">
        <line x1={rulerZeroX} y1="92" x2={rulerZeroX} y2="145" stroke="#bec7ca" strokeWidth="7" strokeLinecap="round" />
        <rect x={rulerZeroX - 8} y="145" width="16" height="38" rx="2" fill="#111827" />
      </g>

      <g
        className="alligator draggable-clip"
        onPointerDown={startDrag}
        style={{ cursor: "ew-resize" }}
      >
        <line x1={clipX} y1="92" x2={clipX} y2="145" stroke="#bec7ca" strokeWidth="7" strokeLinecap="round" />
        <rect x={clipX - 9} y="145" width="18" height="42" rx="2" fill="#b90f0f" />
        <path d={`M${clipX - 13} 139 L${clipX} 126 L${clipX + 13} 139`} fill="none" stroke="#e5edf0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g
        onClick={onShowVoltageMeter}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onShowVoltageMeter();
        }}
        role="button"
        tabIndex="0"
        style={{ cursor: "pointer" }}
      >
        <path d={`M${rulerZeroX} 151 V214 H332`} fill="none" stroke="#17a9c4" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />
        <path d={`M${clipX} 151 V214 H388`} fill="none" stroke="#f25f4c" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />
        <circle cx="360" cy="214" r="28" fill="#ffffff" stroke="#1f2433" strokeWidth="4" />
        <text x="360" y="223" textAnchor="middle" fill="#1f2433" fontSize="26" fontWeight="900">V</text>
      </g>

      <g
        onClick={onShowCurrentMeter}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onShowCurrentMeter();
        }}
        role="button"
        tabIndex="0"
        style={{ cursor: "pointer" }}
      >
        <circle cx="178" cy="318" r="34" fill="#ffffff" stroke="#1f2433" strokeWidth="4" />
        <path d={`M178 318 L${smallMeterNeedleX} ${smallMeterNeedleY}`} stroke="#f25f4c" strokeWidth="4" strokeLinecap="round" />
        <text x="178" y="327" textAnchor="middle" fill="#1f2433" fontSize="28" fontWeight="900">A</text>
        <text x="145" y="286" fill="#5e6b73" fontSize="10" fontWeight="800">0</text>
        <text x="172" y="274" fill="#5e6b73" fontSize="10" fontWeight="800">{(ammeterMax / 2).toFixed(ammeterMax === 5 ? 1 : 0)}</text>
        <text x="209" y="286" fill="#5e6b73" fontSize="10" fontWeight="800">{ammeterMax} A</text>
      </g>

      <g>
        <rect x="435" y="287" width="113" height="92" rx="4" fill="#123d75" stroke="#1f2433" strokeWidth="4" />
        <text x="492" y="315" textAnchor="middle" fill="white" fontSize="19" fontWeight="900">
          {testVoltage.toFixed(1)} V
        </text>
        <path d="M501 321 L468 352 H490 L474 374 L522 336 H500 Z" fill="#ffffff" opacity="0.95" />
        <rect x="452" y="273" width="16" height="18" fill="#e94227" stroke="#1f2433" strokeWidth="3" />
        <rect x="516" y="273" width="16" height="18" fill="#e94227" stroke="#1f2433" strokeWidth="3" />
      </g>

      <path d="M238 318 H420" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowWire)" />
      <path d={`M${clipX + 22} 198 H${Math.min(clipX + 76, 710)}`} stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowWire)" />

      {teacherMode && (
        <>
          <SvgInfoCard
            x="616"
            y="232"
            width={150}
            height={70}
            label="Length"
            value={length.toFixed(3)}
            unit="m"
            revealed={revealedValues.length}
            onFlip={() => onFlip("length")}
            compact
            opacity={0.78}
          />
          <SvgInfoCard
            x="616"
            y="306"
            width={150}
            height={70}
            label="Diameter"
            value={diameter.toFixed(3)}
            unit="mm"
            revealed={revealedValues.diameter}
            onFlip={() => onFlip("diameter")}
            compact
          />

          <SvgInfoCard
            x="248"
            y="248"
            width={132}
            height={66}
            label="Current"
            value={currentA.toFixed(3)}
            unit="A"
            revealed={revealedValues.current}
            onFlip={() => onFlip("current")}
            compact
          />
          <SvgInfoCard
            x="252"
            y="168"
            width={150}
            height={78}
            label="Resistance"
            value={resistance.toFixed(2)}
            unit="Ω"
            revealed={revealedValues.resistance}
            onFlip={() => onFlip("resistance")}
          />
        </>
      )}
    </svg>
  );
}

function DiameterMeasureOverlay({ diameter, onClose }) {
  const gridStep = 24;
  const gridSize = 480;
  const circleRadius = (diameter * 10 * gridStep) / 2;
  const centerX = 280;
  const centerY = 304;

  return (
    <div className="diameter-overlay">
      <button className="diameter-close" onClick={onClose} aria-label="Close diameter grid">
        ×
      </button>
      <svg viewBox="0 0 560 560" width="100%" height="100%" role="img" aria-label="Scaled wire diameter grid">
        <rect width="560" height="560" fill="rgba(255,255,255,0.82)" />
        <text x="28" y="44" fill="#b90f0f" fontSize="30" fontWeight="900">
          Measure Radius and Calculate Area
        </text>
        <rect x="40" y="64" width={gridSize} height={gridSize} fill="#fffef5" stroke="#1f2433" strokeWidth="3" />
        {Array.from({ length: 21 }, (_, index) => {
          const offset = 40 + index * gridStep;
          const major = index % 5 === 0;
          return (
            <g key={index}>
              <line x1={offset} y1="64" x2={offset} y2="544" stroke="#1f2433" strokeWidth={major ? 2.8 : 1.1} opacity={major ? 1 : 0.62} />
              <line x1="40" y1={offset + 24} x2="520" y2={offset + 24} stroke="#1f2433" strokeWidth={major ? 2.8 : 1.1} opacity={major ? 1 : 0.62} />
            </g>
          );
        })}
        <circle
          cx={centerX}
          cy={centerY}
          r={circleRadius}
          fill="rgba(111, 91, 101, 0.36)"
          stroke="#5d545a"
          strokeWidth="2"
        />
        <line x1={centerX - circleRadius} y1={centerY} x2={centerX + circleRadius} y2={centerY} stroke="rgba(185,15,15,0.36)" strokeWidth="6" />
        <line x1={centerX} y1={centerY - circleRadius} x2={centerX} y2={centerY + circleRadius} stroke="rgba(185,15,15,0.22)" strokeWidth="6" />
        <text x="128" y="540" fill="#b90f0f" fontSize="29" fontWeight="900">
          Each Block is 0.1 mm
        </text>
      </svg>
    </div>
  );
}

function CurrentMeterOverlay({ current, onClose }) {
  const meterMax = getAmmeterMax(current);
  const pivotX = 280;
  const pivotY = 398;
  const arcRadius = 230;
  const startAngle = 215;
  const endAngle = 325;
  const needleAngle = getMeterNeedleAngle(current, meterMax);
  const needleLength = 214;
  const needleTipX = pivotX + Math.cos((needleAngle * Math.PI) / 180) * needleLength;
  const needleTipY = pivotY + Math.sin((needleAngle * Math.PI) / 180) * needleLength;

  function polarPoint(angle, radius = arcRadius) {
    return {
      x: pivotX + Math.cos((angle * Math.PI) / 180) * radius,
      y: pivotY + Math.sin((angle * Math.PI) / 180) * radius,
    };
  }

  const arcStart = polarPoint(startAngle);
  const arcEnd = polarPoint(endAngle);

  return (
    <div className="current-overlay">
      <div className="current-meter-title">
        Record Your Current for This Trial
        <button className="current-close" onClick={onClose} aria-label="Close current meter">
          ×
        </button>
      </div>
      <svg viewBox="0 0 560 560" width="100%" height="100%" role="img" aria-label="Analog ammeter">
        <rect width="560" height="560" fill="rgba(0,0,0,0.78)" />
        <circle cx="280" cy="312" r="246" fill="#ffffff" stroke="#111827" strokeWidth="3" />
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {Array.from({ length: 11 }, (_, index) => {
          const tickAngle = startAngle + (index / 10) * (endAngle - startAngle);
          const major = index % 5 === 0;
          const outer = polarPoint(tickAngle, arcRadius + 4);
          const inner = polarPoint(tickAngle, major ? arcRadius - 46 : arcRadius - 24);
          return (
            <line
              key={index}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="#111827"
              strokeWidth={major ? 5 : 4}
              strokeLinecap="round"
            />
          );
        })}
        <text x="104" y="246" textAnchor="middle" fill="#111827" fontSize="34" fontWeight="800">
          0
        </text>
        <text x="280" y="136" textAnchor="middle" fill="#111827" fontSize="40" fontWeight="800">
          {(meterMax / 2).toFixed(meterMax === 5 ? 1 : 0)}
        </text>
        <text x="456" y="246" textAnchor="middle" fill="#111827" fontSize="34" fontWeight="800">
          {meterMax}
        </text>
        <line x1={pivotX} y1={pivotY} x2={needleTipX} y2={needleTipY} stroke="#f01818" strokeWidth="4" strokeLinecap="round" />
        <circle cx={pivotX} cy={pivotY} r="7" fill="#111827" />
        <text x="280" y="314" textAnchor="middle" fill="#b90f0f" fontSize="50" fontWeight="900">
          Amps
        </text>
        <text x="280" y="505" textAnchor="middle" fill="#111827" fontSize="17" fontFamily="Georgia, serif" fontWeight="700">
          Precision Meter
        </text>
      </svg>
    </div>
  );
}

function VoltageMeterOverlay({ voltage, onClose }) {
  const meterMax = 12;
  const pivotX = 280;
  const pivotY = 398;
  const arcRadius = 230;
  const startAngle = 215;
  const endAngle = 325;
  const needleAngle = getInstrumentNeedleAngle(voltage, meterMax);
  const needleLength = 214;
  const needleTipX = pivotX + Math.cos((needleAngle * Math.PI) / 180) * needleLength;
  const needleTipY = pivotY + Math.sin((needleAngle * Math.PI) / 180) * needleLength;

  function polarPoint(angle, radius = arcRadius) {
    return {
      x: pivotX + Math.cos((angle * Math.PI) / 180) * radius,
      y: pivotY + Math.sin((angle * Math.PI) / 180) * radius,
    };
  }

  const arcStart = polarPoint(startAngle);
  const arcEnd = polarPoint(endAngle);

  return (
    <div className="current-overlay voltage-overlay">
      <div className="current-meter-title">
        Record Your Voltage for This Trial
        <button className="current-close" onClick={onClose} aria-label="Close voltmeter">
          ×
        </button>
      </div>
      <svg viewBox="0 0 560 560" width="100%" height="100%" role="img" aria-label="Analog voltmeter">
        <rect width="560" height="560" fill="rgba(0,0,0,0.78)" />
        <circle cx="280" cy="312" r="246" fill="#ffffff" stroke="#111827" strokeWidth="3" />
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {Array.from({ length: 13 }, (_, index) => {
          const tickAngle = startAngle + (index / 12) * (endAngle - startAngle);
          const major = index % 6 === 0;
          const half = index % 3 === 0;
          const outer = polarPoint(tickAngle, arcRadius + 4);
          const inner = polarPoint(tickAngle, major ? arcRadius - 46 : half ? arcRadius - 34 : arcRadius - 24);
          return (
            <line
              key={index}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="#111827"
              strokeWidth={major ? 5 : 4}
              strokeLinecap="round"
            />
          );
        })}
        <text x="104" y="246" textAnchor="middle" fill="#111827" fontSize="34" fontWeight="800">
          0
        </text>
        <text x="280" y="136" textAnchor="middle" fill="#111827" fontSize="40" fontWeight="800">
          6
        </text>
        <text x="456" y="246" textAnchor="middle" fill="#111827" fontSize="34" fontWeight="800">
          12
        </text>
        <line x1={pivotX} y1={pivotY} x2={needleTipX} y2={needleTipY} stroke="#17a9c4" strokeWidth="4" strokeLinecap="round" />
        <circle cx={pivotX} cy={pivotY} r="7" fill="#111827" />
        <text x="280" y="314" textAnchor="middle" fill="#115f73" fontSize="50" fontWeight="900">
          Volts
        </text>
        <text x="280" y="505" textAnchor="middle" fill="#111827" fontSize="17" fontFamily="Georgia, serif" fontWeight="700">
          Precision Meter
        </text>
      </svg>
    </div>
  );
}

function SeriesDiagram({ resistors, totalCurrent, revealedValues, onFlip }) {
  const hasThree = resistors.length === 3;

  return (
    <svg viewBox="0 0 850 390" width="100%" height="100%">
      <defs>
        <marker id="arrowSeries" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#1f2433" />
        </marker>
      </defs>

      <rect width="850" height="390" fill="#fffaf0" />

      <line x1="105" y1="120" x2="165" y2="120" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
      <line x1="118" y1="168" x2="152" y2="168" stroke="#1f2433" strokeWidth="5" strokeLinecap="round" />
      <text x="173" y="124" fill="#1f2433" fontSize="16" fontWeight="800">+</text>
      <text x="163" y="174" fill="#1f2433" fontSize="16" fontWeight="800">−</text>

      <path d="M135 120 V90 H230" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <path d="M135 168 V300 H720 V255" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      <ResistorBox x={230} y={66} label={`R1 = ${resistors[0].toFixed(1)} Ω`} />
      <path d="M350 90 H390" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <ResistorBox x={390} y={66} label={`R2 = ${resistors[1].toFixed(1)} Ω`} />

      {hasThree ? (
        <>
          <path d="M510 90 H550" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
          <ResistorBox x={550} y={66} label={`R3 = ${resistors[2].toFixed(1)} Ω`} />
          <path d="M670 90 H720 V185" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
        </>
      ) : (
        <path d="M510 90 H720 V185" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      )}

      <circle cx="720" cy="220" r="27" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="720" y="229" textAnchor="middle" fill="#1f2433" fontSize="26" fontWeight="900">A</text>
      <line x1="720" y1="185" x2="720" y2="193" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <line x1="720" y1="247" x2="720" y2="255" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      <path d="M185 90 H220" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowSeries)" />
      <path d="M720 130 V175" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowSeries)" />
      <path d="M610 300 H560" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowSeries)" />

      <SvgInfoCard
        x={548}
        y={190}
        width={132}
        height={66}
        label="Series current"
        value={totalCurrent.toFixed(2)}
        unit="A"
        revealed={revealedValues.totalCurrent}
        onFlip={() => onFlip("totalCurrent")}
        compact
      />
    </svg>
  );
}

function ParallelDiagram({ resistors, rows, totalCurrent, revealedValues, onFlip }) {
  const branchPositions = resistors.length === 3 ? [330, 500, 670] : [410, 610];
  const railEnd = branchPositions[branchPositions.length - 1];

  return (
    <svg viewBox="0 0 850 390" width="100%" height="100%">
      <defs>
        <marker id="arrowParallel" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#1f2433" />
        </marker>
      </defs>

      <rect width="850" height="390" fill="#fffaf0" />

      {/* Cell */}
      <line x1="105" y1="120" x2="165" y2="120" stroke="#1f2433" strokeWidth="7" strokeLinecap="round" />
      <line x1="118" y1="168" x2="152" y2="168" stroke="#1f2433" strokeWidth="5" strokeLinecap="round" />
      <text x="173" y="124" fill="#1f2433" fontSize="16" fontWeight="800">+</text>
      <text x="163" y="174" fill="#1f2433" fontSize="16" fontWeight="800">−</text>

      {/* Main circuit path. Ammeter is in series before the branches. */}
      <path d="M135 120 V90 H190" fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      <line x1="190" y1="90" x2="213" y2="90" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
      <circle cx="240" cy="90" r="27" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x="240" y="99" textAnchor="middle" fill="#1f2433" fontSize="26" fontWeight="900">A</text>
      <line x1="267" y1="90" x2={railEnd} y2="90" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      <SvgInfoCard
        x={194}
        y={118}
        width={132}
        height={66}
        label="Total current"
        value={totalCurrent.toFixed(2)}
        unit="A"
        revealed={revealedValues.totalCurrent}
        onFlip={() => onFlip("totalCurrent")}
        compact
      />

      {/* Bottom return rail, ending at the final branch. No excess wire on the right. */}
      <path d={`M135 168 V300 H${railEnd}`} fill="none" stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

      {/* Parallel branches. Resistor rectangles are vertical because the branch wire is vertical. */}
      {branchPositions.map((x, index) => (
        <g key={index}>
          <SvgInfoCard
            x={x + 30}
            y={118}
            width={116}
            height={62}
            label={`I${index + 1}`}
            value={rows[index].current.toFixed(2)}
            unit="A"
            revealed={revealedValues[`branchCurrent${index}`]}
            onFlip={() => onFlip(`branchCurrent${index}`)}
            compact
          />

          <path d={`M${x} 90 V121`} stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

          <circle cx={x} cy="146" r="23" fill="#fff" stroke="#1f2433" strokeWidth="4" />
          <text x={x} y="154" textAnchor="middle" fill="#1f2433" fontSize="23" fontWeight="900">A</text>

          <path d={`M${x} 169 V190`} stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />

          <rect x={x - 27} y="190" width="54" height="88" rx="10" fill="#fff" stroke="#1f2433" strokeWidth="4" />
          <text x={x} y="228" textAnchor="middle" fill="#1f2433" fontSize="14" fontWeight="900">
            R{index + 1}
          </text>
          <text x={x} y="248" textAnchor="middle" fill="#1f2433" fontSize="12" fontWeight="800">
            {resistors[index].toFixed(1)} Ω
          </text>

          <path d={`M${x} 278 V300`} stroke="#1f2433" strokeWidth="8" strokeLinecap="round" />
        </g>
      ))}

      {/* Current direction arrows */}
      <path d="M170 90 H205" stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowParallel)" />
      <path d={`M285 90 H${branchPositions[0] - 35}`} stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowParallel)" />
      <path d={`M${railEnd - 40} 300 H${railEnd - 100}`} stroke="#1f2433" strokeWidth="3" markerEnd="url(#arrowParallel)" />

      <text x="445" y="340" textAnchor="middle" fill="#5e6b73" fontSize="14">
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
      <rect x={x} y={y} width="120" height="48" rx="10" fill="#fff" stroke="#1f2433" strokeWidth="4" />
      <text x={x + 60} y={y - 10} textAnchor="middle" fill="#1f2433" fontSize="14" fontWeight="800">
        {label}
      </text>
    </g>
  );
}

function PredictionQuiz({ topic }) {
  const questions = predictionSets[topic];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const question = questions[questionIndex];

  function nextQuestion() {
    setQuestionIndex((current) => (current + 1) % questions.length);
    setSelectedIndex(null);
  }

  return (
    <div className="quiz-box">
      <div className="quiz-head">
        <strong>Predict first</strong>
        <button className="quiz-next" onClick={nextQuestion}>
          New
        </button>
      </div>

      <div className="quiz-question">{question.question}</div>

      <div className="quiz-options">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = question.answer === index;
          const showCorrect = selectedIndex !== null && isCorrect;

          return (
            <button
              key={option}
              className={
                showCorrect
                  ? "quiz-option correct"
                  : isSelected
                    ? "quiz-option chosen"
                    : "quiz-option"
              }
              onClick={() => setSelectedIndex(index)}
            >
              <span>{option}</span>
              {showCorrect && <span className="checkmark">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FlipValueBox({ label, value, unit, revealed, onFlip, compact = false, diagram = false }) {
  return (
    <button
      type="button"
      className={`${revealed ? "value-box flip-value revealed" : "value-box flip-value"}${compact ? " compact" : ""}${diagram ? " diagram-value" : ""}`}
      onClick={onFlip}
      aria-pressed={revealed}
      aria-label={`${revealed ? "Hide" : "Reveal"} ${label}`}
    >
      <span className="flip-card-inner">
        <span className="flip-card-face flip-card-front">
          <span className="value-label">{label}</span>
          <span className="value-number">?</span>
          <span className="value-unit">{unit}</span>
          <span className="value-hint">Tap to reveal</span>
        </span>
        <span className="flip-card-face flip-card-back">
          <span className="value-label">{label}</span>
          <span className="value-number">{value}</span>
          <span className="value-unit">{unit}</span>
        </span>
      </span>
    </button>
  );
}

function SvgInfoCard({ x, y, width, height, label, value, unit, revealed, onFlip, compact = false, opacity = 1 }) {
  const useCompactLayout = compact || height < 96;

  return (
    <foreignObject x={x} y={y} width={width} height={height} opacity={opacity}>
      <FlipValueBox
        label={label}
        value={value}
        unit={unit}
        revealed={revealed}
        onFlip={onFlip}
        compact={useCompactLayout}
        diagram
      />
    </foreignObject>
  );
}

function StyleBlock() {
  return (
    <style>{`
      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f4fbf8;
        color: #1f2433;
      }

      .app {
        min-height: 100vh;
        padding: 24px;
        background:
          linear-gradient(135deg, rgba(23,169,196,0.16) 0%, rgba(23,169,196,0) 34%),
          linear-gradient(315deg, rgba(242,95,76,0.16) 0%, rgba(242,95,76,0) 36%),
          linear-gradient(180deg, #f7fffb 0%, #edf8ff 52%, #fff7de 100%);
      }

      .page {
        max-width: 1450px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
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
        border-radius: 8px;
        background: linear-gradient(135deg, #17a9c4, #7c5cff 54%, #f25f4c);
        border: 1px solid rgba(255,255,255,0.75);
        box-shadow: 0 14px 30px rgba(23, 169, 196, 0.28);
        color: white;
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
        letter-spacing: 0;
      }

      .subtitle {
        color: #5e6b73;
        font-size: 16px;
        margin-top: 6px;
        line-height: 1.45;
      }

      button {
        border: none;
        border-radius: 8px;
        padding: 11px 16px;
        cursor: pointer;
        font-weight: 700;
        font-size: 16px;
      }

      .button-dark {
        background: linear-gradient(135deg, #1f2433, #115f73);
        color: white;
        box-shadow: 0 10px 20px rgba(17, 95, 115, 0.22);
      }

      .button-light {
        background: #ffffff;
        border: 1px solid #4fb9d7;
        color: #1f2433;
      }

      .full {
        width: 100%;
      }

      .main-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(310px, 340px);
        gap: 18px;
        align-items: start;
      }

      .main-grid > section,
      .main-grid > aside {
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-width: 0;
      }

      .main-grid br {
        display: none;
      }

      .card {
        background: rgba(255,255,255,0.86);
        border: 1px solid #b8d7d2;
        border-radius: 8px;
        box-shadow: 0 14px 34px rgba(31,36,51,0.09);
        overflow: hidden;
      }

      .card-content {
        padding: 16px;
        position: relative;
      }

      .small-title {
        font-family: monospace;
        font-size: 13px;
        letter-spacing: 0.16em;
        color: #316c79;
        margin-bottom: 10px;
        font-weight: 800;
      }

      .topic-panel {
        width: min(360px, 34vw);
        background: rgba(255,255,255,0.9);
        border: 1px solid #b8d7d2;
        border-radius: 8px;
        box-shadow: 0 14px 34px rgba(31,36,51,0.09);
        padding: 12px;
      }

      .topic-select-label {
        align-items: baseline;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
      }

      .topic-select-label .small-title {
        margin-bottom: 0;
      }

      .topic-select-label strong {
        font-size: 13px;
        color: #5e6b73;
        white-space: nowrap;
      }

      .topic-select {
        background: linear-gradient(135deg, #d8f4ff, #fff3b0);
        border-color: #4fb9d7;
        font-weight: 800;
      }

      .mode-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin: 14px 0 16px;
      }

      .mode-button {
        background: #fffaf0;
        border: 1px solid #e6c66e;
        color: #1f2433;
      }

      .mode-button.active {
        background: linear-gradient(135deg, #17a9c4, #7c5cff);
        color: white;
      }

      .switch-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        margin: 12px 0;
      }

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #17a9c4;
      }

      input[type="range"] {
        width: 100%;
        accent-color: #f25f4c;
      }

      input[type="number"] {
        width: 100%;
        border: 1px solid #e6c66e;
        border-radius: 8px;
        padding: 10px;
        font-size: 17px;
        background: #ffffff;
        color: #1f2433;
      }

      select {
        width: 100%;
        border: 1px solid #e6c66e;
        border-radius: 8px;
        padding: 10px;
        font-size: 17px;
        background: #ffffff;
        color: #1f2433;
      }

      .control-group {
        margin: 18px 0;
      }

      .control-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 16px;
      }

      .studio-top {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 12px;
      }

      .studio-title {
        font-size: clamp(30px, 3.5vw, 44px);
      }

      .quiz-box {
        width: 100%;
        background: linear-gradient(180deg, #fff7c8, #fff0a3);
        border: 1px solid #ffd166;
        border-radius: 8px;
        padding: 12px;
        color: #4c515d;
        line-height: 1.45;
      }

      .quiz-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        color: #1f2433;
        font-size: 15px;
        margin-bottom: 8px;
      }

      .quiz-next {
        padding: 6px 10px;
        border-radius: 8px;
        background: rgba(255,255,255,0.72);
        border: 1px solid #ffd166;
        color: #1f2433;
        font-size: 13px;
      }

      .quiz-question {
        font-size: 15px;
        margin-bottom: 10px;
      }

      .quiz-options {
        display: grid;
        gap: 7px;
      }

      .quiz-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid #ffd166;
        background: #ffffff;
        color: #1f2433;
        text-align: left;
        font-size: 14px;
      }

      .quiz-option.chosen {
        background: #ffe2a8;
      }

      .quiz-option.correct {
        background: #dcfce7;
        border-color: #32c36c;
      }

      .checkmark {
        color: #0f8f56;
        font-size: 18px;
        font-weight: 900;
      }

      .simulation {
        height: clamp(190px, 34vw, 320px);
        margin-inline: auto;
        max-width: 720px;
        background: linear-gradient(180deg, #ffffff, #fffaf0);
        border: 1px solid #b8d7d2;
        border-radius: 8px;
        overflow: hidden;
      }

      .wire-simulation {
        height: clamp(300px, 43vw, 390px);
        max-width: 920px;
      }

      .wire-drag-zone {
        cursor: ew-resize;
        touch-action: none;
      }

      .diameter-overlay {
        background: rgba(255,255,255,0.8);
        border: 1px solid rgba(31,36,51,0.22);
        border-radius: 8px;
        box-shadow: 0 18px 44px rgba(31,36,51,0.18);
        height: min(420px, 70vw);
        max-height: calc(100% - 118px);
        opacity: 0.92;
        overflow: hidden;
        position: absolute;
        right: 28px;
        top: 92px;
        width: min(360px, 42vw);
        z-index: 3;
      }

      .diameter-close {
        align-items: center;
        background: rgba(255,255,255,0.88);
        border: 1px solid rgba(31,36,51,0.22);
        border-radius: 8px;
        color: #1f2433;
        display: grid;
        font-size: 24px;
        height: 34px;
        line-height: 1;
        padding: 0;
        place-items: center;
        position: absolute;
        right: 8px;
        top: 8px;
        width: 34px;
        z-index: 4;
      }

      .current-overlay {
        background: rgba(0,0,0,0.76);
        border: 1px solid rgba(31,36,51,0.28);
        border-radius: 8px;
        box-shadow: 0 18px 44px rgba(31,36,51,0.22);
        height: min(520px, 76vw);
        max-height: calc(100% - 72px);
        overflow: hidden;
        position: absolute;
        right: 30px;
        top: 36px;
        width: min(520px, 58vw);
        z-index: 5;
      }

      .current-meter-title {
        align-items: center;
        background: #171717;
        color: white;
        display: flex;
        font-family: Georgia, serif;
        font-size: 23px;
        font-weight: 800;
        justify-content: center;
        min-height: 46px;
        padding: 8px 54px 8px 18px;
        text-align: center;
      }

      .current-close {
        align-items: center;
        background: transparent;
        border: 0;
        color: white;
        display: grid;
        font-size: 44px;
        height: 44px;
        line-height: 1;
        padding: 0;
        place-items: center;
        position: absolute;
        right: 8px;
        top: 2px;
        width: 44px;
      }

      .current-overlay svg {
        display: block;
        height: calc(100% - 62px);
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 9px;
        margin-top: 12px;
      }

      .summary-grid.four {
        grid-template-columns: repeat(4, 1fr);
      }

      .summary-grid.five {
        grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
      }

      .value-box {
        background: #fffaf0;
        border: 1px solid #cfe5df;
        border-radius: 8px;
        padding: 0;
        text-align: center;
        box-shadow: 0 12px 26px rgba(31, 36, 51, 0.12);
      }

      .flip-value {
        min-height: 92px;
        width: 100%;
        height: 100%;
        appearance: none;
        border: 1px solid #cfe5df;
        cursor: pointer;
        color: #1f2433;
        perspective: 900px;
        transition: border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
      }

      .flip-value.compact {
        min-height: 0;
      }

      .flip-value:hover {
        transform: translateY(-1px);
        box-shadow: 0 16px 32px rgba(23, 169, 196, 0.18);
      }

      .flip-value:hover,
      .flip-result:hover {
        border-color: #4fb9d7;
      }

      .flip-value:not(.revealed),
      .flip-result:not(.revealed) {
        background: #fff3b0;
        border-color: #ffd166;
      }

      .flip-value.diagram-value {
        background: rgba(216, 244, 255, 0.82);
        border-color: rgba(23, 169, 196, 0.45);
        box-shadow: 0 8px 18px rgba(31, 36, 51, 0.1);
      }

      .flip-value.diagram-value:not(.revealed) {
        background: rgba(255, 243, 176, 0.84);
        border-color: rgba(242, 95, 76, 0.34);
      }

      .flip-card-inner {
        display: block;
        position: relative;
        width: 100%;
        min-height: 92px;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.48s cubic-bezier(.2,.7,.2,1);
      }

      .flip-value.compact .flip-card-inner {
        min-height: 0;
      }

      .flip-value.revealed .flip-card-inner {
        transform: rotateY(180deg);
      }

      .flip-card-face {
        align-items: center;
        backface-visibility: hidden;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        inset: 0;
        justify-content: center;
        padding: 12px 8px;
        position: absolute;
      }

      .flip-card-front {
        background: linear-gradient(180deg, #fff8d6, #ffd166);
      }

      .flip-card-back {
        background: #fffaf0;
        transform: rotateY(180deg);
      }

      .diagram-value .flip-card-front {
        background: linear-gradient(180deg, rgba(216, 244, 255, 0.95), rgba(255, 243, 176, 0.88));
      }

      .diagram-value .flip-card-back {
        background: rgba(220, 252, 231, 0.9);
      }

      .flip-value.compact .flip-card-face {
        padding: 8px 6px;
      }

      .value-label {
        display: block;
        font-size: 15px;
        color: #5e6b73;
        font-weight: 800;
      }

      .value-number {
        display: block;
        font-size: 28px;
        font-weight: 900;
        margin: 4px 0;
        line-height: 1;
      }

      .value-unit {
        display: block;
        font-size: 16px;
        color: #5e6b73;
        font-weight: 700;
      }

      .value-hint {
        display: block;
        color: #7b6f52;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
        margin-top: 3px;
      }

      .flip-value.compact .value-label {
        font-size: 11px;
      }

      .flip-value.compact .value-number {
        font-size: 20px;
      }

      .flip-value.compact .value-unit {
        font-size: 11px;
      }

      .flip-value.compact .value-hint {
        font-size: 9px;
        margin-top: 1px;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 14px;
        font-size: 16px;
      }

      .data-table th,
      .data-table td {
        border-bottom: 1px solid #d6e8e2;
        padding: 9px 6px;
        text-align: right;
      }

      .data-table th:first-child,
      .data-table td:first-child {
        text-align: left;
      }

      .formula-box {
        background: #fffaf0;
        border: 1px solid #cfe5df;
        border-radius: 8px;
        padding: 14px;
        font-family: Georgia, serif;
        font-size: 24px;
        line-height: 1.5;
        margin: 12px 0;
      }

      .formula-result {
        display: block;
        width: 100%;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #cfe5df;
        font-family: Arial, sans-serif;
        font-size: 28px;
        font-weight: 900;
      }

      .flip-result {
        border-right: 0;
        border-bottom: 0;
        border-left: 0;
        border-radius: 0;
        background: transparent;
        color: #1f2433;
        text-align: left;
      }

      .task-box {
        background: #fff3b0;
        border: 1px solid #ffd166;
        border-radius: 8px;
        padding: 12px;
        font-size: 16px;
        line-height: 1.45;
      }

      .check-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin: 12px 0;
      }

      .check-grid.single {
        grid-template-columns: 1fr;
      }

      .feedback {
        margin-top: 12px;
        border-radius: 8px;
        padding: 12px;
        font-size: 16px;
        background: #fffaf0;
        border: 1px solid #cfe5df;
      }

      .teacher-mode-button {
        margin-top: 12px;
      }

      .good {
        color: #0f8f56;
        font-weight: 800;
      }

      .bad {
        color: #d53329;
        font-weight: 800;
      }

      .graph-area {
        margin-top: 8px;
        background: #fffaf0;
        border: 1px solid #cfe5df;
        border-radius: 8px;
        overflow: hidden;
      }

      .graph-area > svg {
        display: block;
        height: 230px;
      }

      .wire-graphs .graph-area > svg {
        height: 285px;
      }

      .graph-area.compact {
        margin-top: 0;
      }

      .graph-title {
        padding: 10px 14px 0;
        color: #1f2433;
        font-size: 16px;
        font-weight: 900;
      }

      .split-graphs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }

      .tri-graphs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }

      .wire-graphs {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }

      @media (max-width: 880px) {
        .main-grid {
          grid-template-columns: 1fr;
        }

        .header {
          flex-direction: column;
        }

        .topic-panel {
          width: 100%;
        }

        .quiz-box {
          width: 100%;
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

        .studio-top {
          flex-direction: column;
        }

        .check-grid,
        .split-graphs,
        .tri-graphs,
        .wire-graphs {
          grid-template-columns: 1fr;
        }

        .summary-grid,
        .summary-grid.four,
        .summary-grid.five {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .diameter-overlay {
          height: 340px;
          margin-top: 12px;
          max-height: none;
          position: relative;
          right: auto;
          top: auto;
          width: 100%;
        }

        .current-overlay {
          height: 390px;
          margin-top: 12px;
          max-height: none;
          position: relative;
          right: auto;
          top: auto;
          width: 100%;
        }

        .current-meter-title {
          font-size: 20px;
        }

        .summary-grid .flip-value,
        .summary-grid .flip-card-inner {
          min-height: 82px;
        }

        .summary-grid .value-number {
          font-size: 24px;
        }
      }
    `}</style>
  );
}
