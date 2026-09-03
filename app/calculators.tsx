"use client";

import { useState } from "react";
import { Activity, Droplets, ExternalLink, HeartPulse, ShieldAlert, Stethoscope, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

const SOURCES = {
  meld: "https://www.hrsa.gov/optn/data-calculators/allocation-calculators/meld-calculator",
  child: "https://www.hepatitisc.uw.edu/page/management-cirrhosis-related-complications/calculating-child-turcotte-pugh-score",
  mdf: "https://www.aasld.org/liver-fellow-network/core-series/why-series/why-do-we-use-steroids-maddreys-discriminant-function",
  alcohol: "https://webfiles.gi.org/links/journals/ACG-Alcohol-Associated-Liver-Disease-Guidelines-Highlights-2024.pdf",
  lille: "https://onlinelibrary.wiley.com/doi/full/10.1002/hep.21607",
  fib4: "https://www.aasld.org/liver-fellow-network/core-series/why-series/why-are-non-invasive-risk-scores-such-fib-4-used",
  apri: "https://www.hepatitisc.uw.edu/page/clinical-calculators/apri",
  gbs: "https://pubmed.ncbi.nlm.nih.gov/11073021/",
  upperGiBleed: "https://pubmed.ncbi.nlm.nih.gov/33929377/",
  bisap: "https://pubmed.ncbi.nlm.nih.gov/18519429/",
  pancreatitis: "https://webfiles.gi.org/links/journals/AJG-Clinical-Guidelines-Highlights-Acute-Pancreatitis-2024-FINAL.pdf",
};

type NumberFieldProps = {
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  step?: string;
};

function NumberField({ label, unit, value, onChange, min = "0", max, step = "any" }: NumberFieldProps) {
  return <label className="calc-field"><span>{label}{unit && <small>{unit}</small>}</span><input type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="calc-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}

function ToggleField({ label, checked, onChange, note }: { label: string; checked: boolean; onChange: (value: boolean) => void; note?: string }) {
  return <div className="toggle-field"><div><strong>{label}</strong>{note && <small>{note}</small>}</div><Switch checked={checked} onCheckedChange={onChange} aria-label={label} /></div>;
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="calc-source" href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={13} /></a>;
}

function Result({ label, value, children, tone = "neutral" }: { label: string; value: string; children: React.ReactNode; tone?: "neutral" | "warning" | "danger" }) {
  return <div className={`calc-result result-${tone}`}><span>{label}</span><strong>{value}</strong><p>{children}</p></div>;
}

function CalcCard({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <article className="calculator-card"><header><span className="calculator-icon">{icon}</span><div><h3>{title}</h3><p>{subtitle}</p></div></header>{children}</article>;
}

function num(value: string) { return value === "" ? Number.NaN : Number(value); }
function clamp(value: number, minimum: number, maximum: number) { return Math.min(Math.max(value, minimum), maximum); }
function isPositive(...values: number[]) { return values.every((value) => Number.isFinite(value) && value > 0); }

function MeldCalculator() {
  const [bilirubin, setBilirubin] = useState(""); const [inr, setInr] = useState("");
  const [creatinine, setCreatinine] = useState(""); const [sodium, setSodium] = useState("");
  const [albumin, setAlbumin] = useState(""); const [female, setFemale] = useState(false);
  const [dialysis, setDialysis] = useState(false);
  const values = [num(bilirubin), num(inr), num(creatinine), num(sodium), num(albumin)];
  const valid = isPositive(...values);
  let score: number | null = null;
  if (valid) {
    const bili = Math.max(values[0], 1); const normalizedInr = Math.max(values[1], 1);
    const cr = dialysis ? 3 : clamp(values[2], 1, 3); const na = clamp(values[3], 125, 137);
    const alb = clamp(values[4], 1.5, 3.5);
    const raw = (female ? 1.33 : 0) + 4.56 * Math.log(bili) + 0.82 * (137 - na) - 0.24 * (137 - na) * Math.log(bili) + 9.09 * Math.log(normalizedInr) + 11.14 * Math.log(cr) + 1.85 * (3.5 - alb) - 1.83 * (3.5 - alb) * Math.log(cr) + 6;
    score = clamp(Math.round(raw), 6, 40);
  }
  return <CalcCard title="MELD 3.0" subtitle="Adult liver transplant allocation score" icon={<Activity size={20} />}>
    <div className="calc-fields"><NumberField label="Bilirubin" unit="mg/dL" value={bilirubin} onChange={setBilirubin} /><NumberField label="INR" value={inr} onChange={setInr} />
      <NumberField label="Creatinine" unit="mg/dL" value={creatinine} onChange={setCreatinine} /><NumberField label="Sodium" unit="mEq/L" value={sodium} onChange={setSodium} />
      <NumberField label="Albumin" unit="g/dL" value={albumin} onChange={setAlbumin} />
      <ToggleField label="Female sex" checked={female} onChange={setFemale} note="Adult allocation equation term" />
      <ToggleField label="Dialysis criterion met" checked={dialysis} onChange={setDialysis} note="≥2 sessions in 7 days or ≥24 h CVVHD" />
    </div>
    <Result label="MELD 3.0" value={score === null ? "—" : String(score)} tone={score !== null && score >= 30 ? "danger" : score !== null && score >= 20 ? "warning" : "neutral"}>{score === null ? "Enter all laboratory values." : "Allocation score only. Confirm the official OPTN value and exception status before transplant decisions."}</Result>
    <p className="calc-formula">OPTN bounds applied: bilirubin/INR ≥1; creatinine 1–3; sodium 125–137; albumin 1.5–3.5; final score 6–40.</p><SourceLink href={SOURCES.meld}>HRSA/OPTN official MELD calculator</SourceLink>
  </CalcCard>;
}

function ChildPughCalculator() {
  const [bilirubin, setBilirubin] = useState(""); const [albumin, setAlbumin] = useState(""); const [inr, setInr] = useState("");
  const [ascites, setAscites] = useState(""); const [encephalopathy, setEncephalopathy] = useState("");
  const bili = num(bilirubin); const alb = num(albumin); const ratio = num(inr);
  const valid = isPositive(bili, alb, ratio) && ascites !== "" && encephalopathy !== "";
  const points = valid ? (bili < 2 ? 1 : bili <= 3 ? 2 : 3) + (alb > 3.5 ? 1 : alb >= 2.8 ? 2 : 3) + (ratio < 1.7 ? 1 : ratio <= 2.3 ? 2 : 3) + Number(ascites) + Number(encephalopathy) : null;
  const grade = points === null ? "—" : points <= 6 ? `Class A · ${points}` : points <= 9 ? `Class B · ${points}` : `Class C · ${points}`;
  return <CalcCard title="Child–Pugh" subtitle="Severity of chronic liver disease" icon={<Stethoscope size={20} />}>
    <div className="calc-fields"><NumberField label="Bilirubin" unit="mg/dL" value={bilirubin} onChange={setBilirubin} /><NumberField label="Albumin" unit="g/dL" value={albumin} onChange={setAlbumin} /><NumberField label="INR" value={inr} onChange={setInr} />
      <SelectField label="Ascites" value={ascites} onChange={setAscites}><option value="">Select…</option><option value="1">None</option><option value="2">Mild / diuretic-responsive</option><option value="3">Moderate–severe / refractory</option></SelectField>
      <SelectField label="Encephalopathy" value={encephalopathy} onChange={setEncephalopathy}><option value="">Select…</option><option value="1">None</option><option value="2">Grade I–II</option><option value="3">Grade III–IV</option></SelectField>
    </div>
    <Result label="CHILD–PUGH" value={grade} tone={points !== null && points >= 10 ? "danger" : points !== null && points >= 7 ? "warning" : "neutral"}>{points === null ? "Complete all five variables." : points <= 6 ? "Class A (5–6)." : points <= 9 ? "Class B (7–9)." : "Class C (10–15)."}</Result>
    <p className="calc-formula">Uses standard bilirubin thresholds; disease-specific bilirubin cutoffs may apply in cholestatic disorders.</p><SourceLink href={SOURCES.child}>Hepatitis C Online clinical reference</SourceLink>
  </CalcCard>;
}

function MaddreyCalculator() {
  const [pt, setPt] = useState(""); const [control, setControl] = useState(""); const [bilirubin, setBilirubin] = useState("");
  const values = [num(pt), num(control), num(bilirubin)]; const valid = isPositive(...values);
  const score = valid ? 4.6 * (values[0] - values[1]) + values[2] : null;
  return <CalcCard title="Maddrey DF" subtitle="Alcohol-associated hepatitis severity" icon={<Droplets size={20} />}>
    <div className="calc-fields"><NumberField label="Patient PT" unit="seconds" value={pt} onChange={setPt} /><NumberField label="Control PT" unit="seconds" value={control} onChange={setControl} /><NumberField label="Bilirubin" unit="mg/dL" value={bilirubin} onChange={setBilirubin} /></div>
    <Result label="MADDREY DF" value={score === null ? "—" : score.toFixed(1)} tone={score !== null && score >= 32 ? "danger" : "neutral"}>{score === null ? "Enter patient PT, local laboratory control PT, and bilirubin." : score >= 32 ? "≥32: historically defines severe/high-risk disease. Assess MELD, infection, bleeding, renal injury, and steroid contraindications." : "<32: does not meet the historical MDF severe threshold; use the full clinical assessment."}</Result>
    <p className="calc-formula">4.6 × (patient PT − control PT) + bilirubin. ACG 2024 prioritizes MELD &gt;20 for severe alcohol-associated hepatitis.</p><div className="calc-source-row"><SourceLink href={SOURCES.mdf}>AASLD MDF review</SourceLink><SourceLink href={SOURCES.alcohol}>ACG 2024 guidance</SourceLink></div>
  </CalcCard>;
}

function LilleCalculator() {
  const [age, setAge] = useState(""); const [albumin, setAlbumin] = useState(""); const [pt, setPt] = useState("");
  const [baselineBili, setBaselineBili] = useState(""); const [dayBili, setDayBili] = useState(""); const [creatinine, setCreatinine] = useState("");
  const values = [num(age), num(albumin), num(pt), num(baselineBili), num(dayBili), num(creatinine)]; const valid = isPositive(...values);
  let score: number | null = null;
  if (valid) {
    const albuminGl = values[1] * 10; const baselineUmol = values[3] * 17.1; const evolutionUmol = (values[3] - values[4]) * 17.1; const renal = values[5] > 1.3 ? 1 : 0;
    const r = 3.19 - 0.101 * values[0] + 0.147 * albuminGl + 0.0165 * evolutionUmol - 0.206 * renal - 0.0065 * baselineUmol - 0.0096 * values[2];
    score = Math.exp(-r) / (1 + Math.exp(-r));
  }
  return <CalcCard title="Lille score" subtitle="Response after corticosteroid initiation" icon={<HeartPulse size={20} />}>
    <div className="calc-fields"><NumberField label="Age" unit="years" value={age} onChange={setAge} /><NumberField label="Baseline albumin" unit="g/dL" value={albumin} onChange={setAlbumin} /><NumberField label="Prothrombin time" unit="seconds" value={pt} onChange={setPt} /><NumberField label="Baseline bilirubin" unit="mg/dL" value={baselineBili} onChange={setBaselineBili} /><NumberField label="Day 7 bilirubin" unit="mg/dL" value={dayBili} onChange={setDayBili} /><NumberField label="Baseline creatinine" unit="mg/dL" value={creatinine} onChange={setCreatinine} /></div>
    <Result label="LILLE" value={score === null ? "—" : score.toFixed(3)} tone={score !== null && score > 0.45 ? "danger" : "neutral"}>{score === null ? "Enter the six variables." : score > 0.45 ? ">0.45: corticosteroid nonresponse; ACG recommends discontinuing corticosteroids." : "≤0.45: response by the original cutoff; continue reassessment for adverse effects and contraindications."}</Result>
    <p className="calc-formula">Original model uses day 7 bilirubin; ACG permits response assessment at day 4 or 7. This implementation preserves the original day 7 equation.</p><div className="calc-source-row"><SourceLink href={SOURCES.lille}>Original Lille model</SourceLink><SourceLink href={SOURCES.alcohol}>ACG 2024 guidance</SourceLink></div>
  </CalcCard>;
}

function Fib4Calculator() {
  const [age, setAge] = useState(""); const [ast, setAst] = useState(""); const [alt, setAlt] = useState(""); const [platelets, setPlatelets] = useState("");
  const values = [num(age), num(ast), num(alt), num(platelets)]; const valid = isPositive(...values); const score = valid ? values[0] * values[1] / (values[3] * Math.sqrt(values[2])) : null;
  return <CalcCard title="FIB-4" subtitle="Noninvasive liver fibrosis triage" icon={<Activity size={20} />}>
    <div className="calc-fields"><NumberField label="Age" unit="years" value={age} onChange={setAge} /><NumberField label="AST" unit="U/L" value={ast} onChange={setAst} /><NumberField label="ALT" unit="U/L" value={alt} onChange={setAlt} /><NumberField label="Platelets" unit="10⁹/L" value={platelets} onChange={setPlatelets} /></div>
    <Result label="FIB-4" value={score === null ? "—" : score.toFixed(2)} tone={score !== null && score > 2.67 ? "warning" : "neutral"}>{score === null ? "Enter age, AST, ALT, and platelets." : score < 1.3 ? "<1.3: low risk in common MASLD pathways; periodic reassessment may be appropriate." : score > 2.67 ? ">2.67: high risk in common MASLD pathways; refer or perform secondary fibrosis assessment." : "1.3–2.67: indeterminate; obtain secondary assessment such as elastography where appropriate."}</Result>
    <p className="calc-formula">Age × AST ÷ (platelets × √ALT). For age ≥65, AASLD uses a &gt;2.0 lower threshold in MASLD. In simplified HCV care, FIB-4 &gt;3.25 is one criterion for presumptive cirrhosis.</p><SourceLink href={SOURCES.fib4}>AASLD FIB-4 review</SourceLink>
  </CalcCard>;
}

function ApriCalculator() {
  const [ast, setAst] = useState(""); const [uln, setUln] = useState(""); const [platelets, setPlatelets] = useState("");
  const values = [num(ast), num(uln), num(platelets)]; const valid = isPositive(...values); const score = valid ? (values[0] / values[1]) * 100 / values[2] : null;
  return <CalcCard title="APRI" subtitle="AST-to-platelet ratio index" icon={<Droplets size={20} />}>
    <div className="calc-fields"><NumberField label="AST" unit="U/L" value={ast} onChange={setAst} /><NumberField label="AST upper limit" unit="U/L" value={uln} onChange={setUln} /><NumberField label="Platelets" unit="10⁹/L" value={platelets} onChange={setPlatelets} /></div>
    <Result label="APRI" value={score === null ? "—" : score.toFixed(2)} tone={score !== null && score >= 2 ? "warning" : "neutral"}>{score === null ? "Enter AST, the reporting laboratory’s AST ULN, and platelets." : score >= 2 ? "≥2: increases the likelihood of cirrhosis, but sensitivity is limited; confirm with other fibrosis evidence." : score >= 1 ? "1.0–1.99: raises concern for significant fibrosis; interpret with other noninvasive testing." : "<1.0: below the commonly used cirrhosis rule-in threshold; fibrosis is not excluded."}</Result>
    <p className="calc-formula">[(AST ÷ AST ULN) × 100] ÷ platelets.</p><SourceLink href={SOURCES.apri}>Hepatitis C Online APRI calculator</SourceLink>
  </CalcCard>;
}

function PageBCalculator() {
  const [age, setAge] = useState(""); const [sex, setSex] = useState("female"); const [platelets, setPlatelets] = useState("");
  const ageValue = num(age); const plateletValue = num(platelets);
  const agePoints = ageValue >= 70 ? 10 : ageValue >= 60 ? 8 : ageValue >= 50 ? 6 : ageValue >= 40 ? 4 : ageValue >= 30 ? 2 : ageValue >= 16 ? 0 : null;
  const plateletPoints = plateletValue > 0 ? (plateletValue < 100 ? 9 : plateletValue < 200 ? 6 : 0) : null;
  const score = agePoints === null || plateletPoints === null ? null : agePoints + plateletPoints + (sex === "male" ? 6 : 0);
  return <CalcCard title="PAGE-B" subtitle="HCC risk during HBV antiviral therapy" icon={<ShieldAlert size={20} />}>
    <div className="calc-fields"><NumberField label="Age" unit="years (16+)" value={age} onChange={setAge} /><SelectField label="Sex" value={sex} onChange={setSex}><option value="female">Female</option><option value="male">Male</option></SelectField><NumberField label="Platelets" unit="10⁹/L" value={platelets} onChange={setPlatelets} /></div>
    <Result label="PAGE-B" value={score === null ? "—" : String(score)} tone={score !== null && score >= 18 ? "danger" : score !== null && score >= 10 ? "warning" : "neutral"}>{score === null ? "Enter age ≥16 years and platelets." : score >= 18 ? "High risk (≥18). Continue guideline-based HCC surveillance." : score >= 10 ? "Intermediate risk (10–17). PAGE-B ≥10 is an AASLD/IDSA surveillance criterion during treatment." : "Low risk (0–9). Do not use PAGE-B to override surveillance indicated by cirrhosis, age/origin, family history, HDV, or HIV."}</Result>
    <p className="calc-formula">Validated for selected adults receiving HBV antiviral therapy; it is not an HBV treatment-initiation score.</p><SourceLink href="https://www.idsociety.org/practice-guideline/hepatitis-b/hepatitis-b/">AASLD/IDSA HBV guideline</SourceLink>
  </CalcCard>;
}

function GlasgowBlatchfordCalculator() {
  const [bun, setBun] = useState(""); const [hemoglobin, setHemoglobin] = useState(""); const [sex, setSex] = useState("female"); const [sbp, setSbp] = useState(""); const [heartRate, setHeartRate] = useState("");
  const [melena, setMelena] = useState(false); const [syncope, setSyncope] = useState(false); const [liverDisease, setLiverDisease] = useState(false); const [heartFailure, setHeartFailure] = useState(false);
  const values = [num(bun), num(hemoglobin), num(sbp), num(heartRate)]; const valid = isPositive(...values);
  let score: number | null = null;
  if (valid) {
    const bunPoints = values[0] >= 42 ? 6 : values[0] >= 28 ? 4 : values[0] >= 22.4 ? 3 : values[0] >= 18.2 ? 2 : 0;
    const hgbPoints = sex === "male" ? (values[1] < 10 ? 6 : values[1] < 12 ? 3 : values[1] < 13 ? 1 : 0) : (values[1] < 10 ? 6 : values[1] < 12 ? 1 : 0);
    const sbpPoints = values[2] < 90 ? 3 : values[2] < 100 ? 2 : values[2] < 110 ? 1 : 0;
    score = bunPoints + hgbPoints + sbpPoints + (values[3] >= 100 ? 1 : 0) + (melena ? 1 : 0) + (syncope ? 2 : 0) + (liverDisease ? 2 : 0) + (heartFailure ? 2 : 0);
  }
  return <CalcCard title="Glasgow-Blatchford" subtitle="Pre-endoscopic upper GI bleeding risk" icon={<Droplets size={20} />}>
    <div className="calc-fields"><NumberField label="BUN" unit="mg/dL" value={bun} onChange={setBun} /><NumberField label="Hemoglobin" unit="g/dL" value={hemoglobin} onChange={setHemoglobin} /><SelectField label="Sex" value={sex} onChange={setSex}><option value="female">Female</option><option value="male">Male</option></SelectField><NumberField label="Systolic BP" unit="mm Hg" value={sbp} onChange={setSbp} /><NumberField label="Heart rate" unit="beats/min" value={heartRate} onChange={setHeartRate} />
      <ToggleField label="Melena" checked={melena} onChange={setMelena} /><ToggleField label="Syncope" checked={syncope} onChange={setSyncope} /><ToggleField label="Hepatic disease" checked={liverDisease} onChange={setLiverDisease} /><ToggleField label="Heart failure" checked={heartFailure} onChange={setHeartFailure} />
    </div>
    <Result label="GLASGOW-BLATCHFORD" value={score === null ? "—" : String(score)} tone={score !== null && score > 1 ? "warning" : "neutral"}>{score === null ? "Enter BUN, hemoglobin, sex, systolic BP, and heart rate; then set clinical factors." : score <= 1 ? "0–1: very-low-risk range in ACG guidance; outpatient management may be considered only with appropriate clinical assessment and follow-up." : ">1: not in the ACG very-low-risk discharge range; manage according to the complete bleeding pathway."}</Result>
    <p className="calc-formula">Designed for suspected upper GI bleeding before endoscopy. It does not replace resuscitation, consultation, or judgment about active bleeding.</p><div className="calc-source-row"><SourceLink href={SOURCES.gbs}>Original Lancet derivation study</SourceLink><SourceLink href={SOURCES.upperGiBleed}>ACG upper GI bleeding guideline</SourceLink></div>
  </CalcCard>;
}

function BisapCalculator() {
  const [bun, setBun] = useState(false); const [mental, setMental] = useState(false); const [sirs, setSirs] = useState(false); const [age, setAge] = useState(false); const [effusion, setEffusion] = useState(false);
  const score = [bun, mental, sirs, age, effusion].filter(Boolean).length;
  return <CalcCard title="BISAP" subtitle="Acute pancreatitis severity in first 24 hours" icon={<Activity size={20} />}>
    <div className="calc-fields calc-toggles"><ToggleField label="BUN >25 mg/dL" checked={bun} onChange={setBun} /><ToggleField label="Impaired mental status" checked={mental} onChange={setMental} note="GCS <15" /><ToggleField label="SIRS present" checked={sirs} onChange={setSirs} note="≥2 standard SIRS criteria" /><ToggleField label="Age >60 years" checked={age} onChange={setAge} /><ToggleField label="Pleural effusion" checked={effusion} onChange={setEffusion} /></div>
    <Result label="BISAP" value={String(score)} tone={score >= 3 ? "danger" : score >= 2 ? "warning" : "neutral"}>{score >= 3 ? "≥3: higher risk of severe disease and mortality; use monitored care and reassess trajectory." : "0–2: lower score, but deterioration remains possible; repeat clinical assessment and follow BUN, hematocrit, SIRS, organ failure, and imaging indications."}</Result>
    <p className="calc-formula">One point each in the first 24 hours. SIRS = ≥2: temperature &gt;38 or &lt;36°C, HR &gt;90, RR &gt;20 or PaCO₂ &lt;32, WBC &gt;12 or &lt;4 ×10⁹/L or &gt;10% bands.</p><div className="calc-source-row"><SourceLink href={SOURCES.bisap}>Original BISAP study</SourceLink><SourceLink href={SOURCES.pancreatitis}>ACG 2024 guidance</SourceLink></div>
  </CalcCard>;
}

export function CalculatorHub({ onClose }: { onClose: () => void }) {
  return <section className="calculator-workspace" role="dialog" aria-modal="true" aria-label="GI calculators">
    <div className="calculator-shell">
      <header className="calculator-head"><div><span className="eyebrow">POINT-OF-CARE TOOLS</span><h2>GI Calculators</h2><p>Nine validated clinical scores. Inputs stay on this device and are not saved.</p></div><button onClick={onClose} aria-label="Close calculators"><X size={22} /></button></header>
      <div className="calculator-safety"><ShieldAlert size={18} /><p><strong>Verify before acting.</strong> Scores support—not replace—diagnosis, stabilization, contraindication review, current guidance, and specialist judgment. Do not enter patient identifiers.</p></div>
      <Accordion type="multiple" defaultValue={["hepatology"]} className="calculator-groups">
        <AccordionItem value="hepatology"><AccordionTrigger><span><b>Hepatology</b><small>7 calculators · severity, fibrosis, response, surveillance</small></span></AccordionTrigger><AccordionContent><div className="calculator-grid"><MeldCalculator /><ChildPughCalculator /><MaddreyCalculator /><LilleCalculator /><Fib4Calculator /><ApriCalculator /><PageBCalculator /></div></AccordionContent></AccordionItem>
        <AccordionItem value="bleeding"><AccordionTrigger><span><b>GI bleeding</b><small>1 calculator · pre-endoscopic risk</small></span></AccordionTrigger><AccordionContent><div className="calculator-grid"><GlasgowBlatchfordCalculator /></div></AccordionContent></AccordionItem>
        <AccordionItem value="pancreatitis"><AccordionTrigger><span><b>Pancreatitis</b><small>1 calculator · early severity</small></span></AccordionTrigger><AccordionContent><div className="calculator-grid"><BisapCalculator /></div></AccordionContent></AccordionItem>
      </Accordion>
      <p className="calculator-disclaimer">For qualified clinicians. Confirm calculations against the linked primary or guideline source when a result will affect urgent treatment, transplant allocation, steroid continuation, disposition, or surveillance.</p>
    </div>
  </section>;
}
