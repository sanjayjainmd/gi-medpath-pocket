"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, Calculator, Check,
  ChevronRight, Download, ExternalLink, FileDown, HeartPulse, Info,
  Menu, MonitorCheck, Pill, Search, ShieldAlert, Stethoscope, X,
} from "lucide-react";
import {
  drugs, hardStops, modules, monitorCards, pathways, sources,
  type Drug, type ModuleKey,
} from "./content";
import { CalculatorHub } from "./calculators";

type ViewKey = "path" | "drugs" | "monitor" | "tools";
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const viewItems: { key: ViewKey; label: string; icon: typeof Activity }[] = [
  { key: "path", label: "Decide", icon: Activity },
  { key: "drugs", label: "Drugs", icon: Pill },
  { key: "monitor", label: "Monitor", icon: MonitorCheck },
  { key: "tools", label: "Tools", icon: Calculator },
];

function Signal({ label, children, danger = false }: { label: string; children: React.ReactNode; danger?: boolean }) {
  return <div className={danger ? "signal signal-danger" : "signal signal-info"}>
    {danger ? <ShieldAlert size={19} /> : <Info size={19} />}
    <div><strong>{label}</strong><p>{children}</p></div>
  </div>;
}

function DrugCard({ drug, onOpen }: { drug: Drug; onOpen: (drug: Drug) => void }) {
  return <button className="drug-card" onClick={() => onOpen(drug)}>
    <div className="drug-card-top"><span className="class-tag">{drug.drugClass}</span><ChevronRight size={18} /></div>
    <h3>{drug.brand}</h3><p className="generic">{drug.generic}</p>
    <p className="dose-preview">{drug.dose}</p><span className="use-line">{drug.use}</span>
  </button>;
}

function Pathway({ module }: { module: ModuleKey }) {
  return <div className="pathway">{pathways[module].map((step, index) =>
    <article className={`path-step tone-${step.tone ?? "teal"}`} key={step.kicker}>
      <div className="step-index">{index + 1}</div>
      <div className="step-content"><span className="eyebrow">{step.kicker}</span><h3>{step.question}</h3>
        <div className="branches"><div className="branch branch-yes"><span>YES</span><p>{step.yes}</p></div>
          {step.no && <div className="branch branch-no"><span>NO / NEXT</span><p>{step.no}</p></div>}
        </div>
      </div>
    </article>)}</div>;
}

function Fib4Calculator() {
  const [age, setAge] = useState(""); const [ast, setAst] = useState("");
  const [alt, setAlt] = useState(""); const [platelets, setPlatelets] = useState("");
  const valid = [age, ast, alt, platelets].every((v) => Number(v) > 0);
  const result = valid ? (Number(age) * Number(ast)) / (Number(platelets) * Math.sqrt(Number(alt))) : null;
  return <article className="tool-card">
    <div className="tool-heading"><Calculator size={20} /><div><h3>FIB-4</h3><p>HCV fibrosis screen</p></div></div>
    <div className="calc-grid">
      <label>Age <input inputMode="decimal" value={age} onChange={(e) => setAge(e.target.value)} placeholder="years" /></label>
      <label>AST <input inputMode="decimal" value={ast} onChange={(e) => setAst(e.target.value)} placeholder="U/L" /></label>
      <label>ALT <input inputMode="decimal" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="U/L" /></label>
      <label>Platelets <input inputMode="decimal" value={platelets} onChange={(e) => setPlatelets(e.target.value)} placeholder="10⁹/L" /></label>
    </div>
    <div className="result-box"><span>FIB-4</span><strong>{result === null ? "—" : result.toFixed(2)}</strong>
      <p>{result === null ? "Enter all four values." : result > 3.25 ? "Above the simplified-pathway cirrhosis presumption threshold (>3.25)." : "Does not cross the >3.25 simplified-pathway cirrhosis threshold; interpret with other fibrosis evidence."}</p>
    </div><p className="formula">Age × AST ÷ [platelets × √ALT]</p>
  </article>;
}

function PageBCalculator() {
  const [age, setAge] = useState(""); const [sex, setSex] = useState("female"); const [platelets, setPlatelets] = useState("");
  const ageNumber = Number(age); const plateletNumber = Number(platelets);
  const agePoints = ageNumber >= 70 ? 10 : ageNumber >= 60 ? 8 : ageNumber >= 50 ? 6 : ageNumber >= 40 ? 4 : ageNumber >= 30 ? 2 : ageNumber >= 16 ? 0 : null;
  const plateletPoints = plateletNumber > 0 ? (plateletNumber < 100 ? 9 : plateletNumber < 200 ? 6 : 0) : null;
  const total = agePoints === null || plateletPoints === null ? null : agePoints + plateletPoints + (sex === "male" ? 6 : 0);
  return <article className="tool-card">
    <div className="tool-heading"><HeartPulse size={20} /><div><h3>PAGE-B</h3><p>Treated HBV HCC risk</p></div></div>
    <div className="calc-grid">
      <label>Age <input inputMode="decimal" value={age} onChange={(e) => setAge(e.target.value)} placeholder="16+ years" /></label>
      <label>Sex <select value={sex} onChange={(e) => setSex(e.target.value)}><option value="female">Female</option><option value="male">Male</option></select></label>
      <label className="wide">Platelets <input inputMode="decimal" value={platelets} onChange={(e) => setPlatelets(e.target.value)} placeholder="10⁹/L" /></label>
    </div>
    <div className="result-box"><span>PAGE-B</span><strong>{total === null ? "—" : total}</strong>
      <p>{total === null ? "Enter age and platelets." : total >= 18 ? "High risk (≥18)." : total >= 10 ? "Intermediate risk (10–17); PAGE-B ≥10 is an AASLD/IDSA surveillance criterion." : "Low risk (0–9). Interpret within the complete HBV surveillance pathway."}</p>
    </div>
  </article>;
}

function CtpReference() {
  const rows = [["Bilirubin", "<2", "2–3", ">3 mg/dL"], ["Albumin", ">3.5", "2.8–3.5", "<2.8 g/dL"], ["INR", "<1.7", "1.7–2.3", ">2.3"], ["Ascites", "None", "Mild", "Moderate–severe"], ["Encephalopathy", "None", "Grade I–II", "Grade III–IV"]];
  return <article className="tool-card full-tool">
    <div className="tool-heading"><Stethoscope size={20} /><div><h3>Child–Turcotte–Pugh reference</h3><p>1 / 2 / 3 points by column</p></div></div>
    <div className="table-wrap"><table><thead><tr><th>Variable</th><th>1 point</th><th>2 points</th><th>3 points</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <p className="formula">CTP A: 5–6 · B: 7–9 · C: 10–15. Any current/prior decompensation excludes HCV protease inhibitors regardless of score.</p>
  </article>;
}

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("ibd");
  const [activeView, setActiveView] = useState<ViewKey>("path");
  const [query, setQuery] = useState(""); const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [installOpen, setInstallOpen] = useState(false); const [menuOpen, setMenuOpen] = useState(false);
  const [calculatorsOpen, setCalculatorsOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => { if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);
  useEffect(() => {
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
  }, []);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === "Escape" && (setSelectedDrug(null), setInstallOpen(false), setCalculatorsOpen(false)); document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);

  const visibleDrugs = useMemo(() => { const normalized = query.trim().toLowerCase(); return drugs.filter((drug) => drug.module === activeModule && (!normalized || [drug.generic, drug.brand, drug.drugClass, drug.use, drug.dose, drug.role, ...drug.warnings, ...drug.monitoring].join(" ").toLowerCase().includes(normalized))); }, [activeModule, query]);
  const switchModule = (key: ModuleKey) => { setActiveModule(key); setQuery(""); setMenuOpen(false); };
  const requestInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setInstallPrompt(null);
      return;
    }
    setInstallOpen(true);
  };
  const isAppleMobile = typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  const isAndroid = typeof navigator !== "undefined" && /Android/.test(navigator.userAgent);

  return <main className="app-shell" style={{ "--module": modules[activeModule].color } as React.CSSProperties}>
    <header className="topbar"><div className="brand-lockup"><div className="brand-mark">GI</div><div><h1>MedPath</h1><span>Pocket Guide</span></div></div>
      <div className="topbar-meta"><span>Clinician reference</span><b>Reviewed 03 Sep 2026</b></div>
      <div className="topbar-actions"><button className="topbar-calculators" onClick={() => setCalculatorsOpen(true)}><Calculator size={17} /><span>Calculators</span></button><button className="icon-button mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={22} /></button></div>
    </header>

    <div className="workspace">
      <aside className={`module-rail ${menuOpen ? "rail-open" : ""}`}><div className="rail-label">PATHWAYS</div>
        {(Object.keys(modules) as ModuleKey[]).map((key) => <button key={key} onClick={() => switchModule(key)} className={activeModule === key ? "module-button active" : "module-button"}>
          <span className="module-monogram" style={{ background: modules[key].color }}>{modules[key].short}</span><span><strong>{modules[key].title}</strong><small>{modules[key].subtitle}</small></span><ChevronRight size={17} />
        </button>)}
        <div className="rail-rule" /><button className="calculator-button" onClick={() => { setCalculatorsOpen(true); setMenuOpen(false); }}><Calculator size={17} /><span><b>GI Calculators</b><small>9 clinical scores</small></span><ChevronRight size={16} /></button><button className="install-button" onClick={requestInstall}><Download size={17} /> Install this app</button><p className="privacy-note"><Check size={14} /> No patient data is stored.</p>
      </aside>

      <section className="main-column">
        <div className="mobile-modules">{(Object.keys(modules) as ModuleKey[]).map((key) => <button key={key} className={activeModule === key ? "active" : ""} onClick={() => switchModule(key)}>{modules[key].short}</button>)}</div>
        <div className="module-heading"><div><span className="eyebrow">{modules[activeModule].short} CLINICAL PATHWAY</span><h2>{modules[activeModule].title}</h2><p>{modules[activeModule].subtitle}</p></div><a className="guide-link" href={modules[activeModule].guide} download><FileDown size={17} /> Full guide</a></div>
        <Signal label={hardStops[activeModule].title} danger>{hardStops[activeModule].body}</Signal>
        <div className="search-row"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value) setActiveView("drugs"); }} placeholder={`Search ${modules[activeModule].short}: drug, class, dose, warning…`} />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button>}</div></div>
        <nav className="view-tabs" aria-label="Section">{viewItems.map((item) => { const Icon = item.icon; return <button key={item.key} className={activeView === item.key ? "active" : ""} onClick={() => setActiveView(item.key)}><Icon size={17} />{item.label}</button>; })}</nav>

        <div className="content-panel">
          {activeView === "path" && <><div className="section-intro"><h3>Decision pathway</h3><p>Follow top to bottom. Safety overrides come first.</p></div><Pathway module={activeModule} /></>}
          {activeView === "drugs" && <><div className="section-intro"><h3>{visibleDrugs.length} medication{visibleDrugs.length === 1 ? "" : "s"}</h3><p>Trade name first; tap for dosing, warnings, and monitoring.</p></div>{visibleDrugs.length ? <div className="drug-grid">{visibleDrugs.map((drug) => <DrugCard key={`${drug.module}-${drug.generic}`} drug={drug} onOpen={setSelectedDrug} />)}</div> : <div className="empty-state"><Search size={24} /><h3>No matches</h3><p>Try a generic name, trade name, class, dose, or warning.</p></div>}</>}
          {activeView === "monitor" && <><div className="section-intro"><h3>Monitoring cadence</h3><p>Individualize to disease state, label, and comorbidity.</p></div><div className="monitor-grid">{monitorCards[activeModule].map((card) => <article className="monitor-card" key={card.title}><h3>{card.title}</h3><ul>{card.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></>}
          {activeView === "tools" && <><div className="section-intro"><h3>Point-of-care tools</h3><p>Inputs are calculated locally and are not retained.</p></div><div className="tools-grid">
            {activeModule === "hcv" && <Fib4Calculator />}{activeModule === "hbv" && <PageBCalculator />}{activeModule !== "ibd" && <CtpReference />}
            {activeModule === "ibd" && <div className="tool-card full-tool"><div className="tool-heading"><Activity size={20} /><div><h3>Treat-to-target checkpoint</h3><p>Compact chart prompt</p></div></div><ol className="checkpoint-list"><li><b>Baseline</b><span>Objective inflammation + CBC/CMP + CRP/FCP + TB/HBV + vaccines + class screens</span></li><li><b>2–8 weeks</b><span>Clinical response, steroid taper, adverse effects</span></li><li><b>8–16 weeks</b><span>Symptoms + biomarkers; stop carrying ineffective therapy</span></li><li><b>6–12 months</b><span>Endoscopy/imaging/intestinal ultrasound by location</span></li></ol></div>}
          </div></>}
        </div>

        <section className="source-block"><div><BookOpen size={18} /><div><h3>Primary guidance & full reference</h3><p>Live guidance can change; verify before prescribing.</p></div></div><div className="source-links">{sources[activeModule].map((source) => <a key={source.href} href={source.href} target={source.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{source.label}<ExternalLink size={14} /></a>)}</div></section>
        <p className="disclaimer">For qualified clinicians. Educational decision support—not a substitute for the current prescribing information, live guideline, interaction checker, or patient-specific judgment. No patient data is collected or stored.</p>
      </section>

      <aside className="quick-rail"><span className="eyebrow">AT A GLANCE</span><h3>Fast moves</h3>
        <button onClick={() => setActiveView("path")}><AlertTriangle size={18} /><span><b>Open safety gate</b><small>First branch</small></span><ArrowRight size={16} /></button>
        <button onClick={() => setActiveView("drugs")}><Pill size={18} /><span><b>Find a dose</b><small>Trade + generic</small></span><ArrowRight size={16} /></button>
        <button onClick={() => setCalculatorsOpen(true)}><Calculator size={18} /><span><b>Open GI calculators</b><small>9 validated scores</small></span><ArrowRight size={16} /></button>
        {activeModule === "hcv" && <a href="https://www.hep-druginteractions.org/checker" target="_blank" rel="noreferrer"><ExternalLink size={18} /><span><b>Check live DDI</b><small>Liverpool HEP</small></span><ArrowRight size={16} /></a>}
      </aside>
    </div>

    {calculatorsOpen && <CalculatorHub onClose={() => setCalculatorsOpen(false)} />}

    {selectedDrug && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setSelectedDrug(null)}><section className="detail-sheet" role="dialog" aria-modal="true" aria-label={`${selectedDrug.brand} details`}>
      <div className="sheet-handle" /><button className="sheet-close" onClick={() => setSelectedDrug(null)} aria-label="Close"><X size={20} /></button><span className="class-tag">{selectedDrug.drugClass}</span><h2>{selectedDrug.brand}</h2><p className="sheet-generic">{selectedDrug.generic}</p><p className="sheet-use">{selectedDrug.use}</p>
      <div className="detail-section"><span>DOSING</span><p>{selectedDrug.dose}</p></div><div className="detail-section"><span>POSITIONING</span><p>{selectedDrug.role}</p></div>
      <div className="detail-section warning-section"><span>KEY WARNINGS</span><ul>{selectedDrug.warnings.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="detail-section"><span>MONITOR</span><ul>{selectedDrug.monitoring.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <a className="sheet-guide" href={modules[selectedDrug.module].guide} download><FileDown size={17} /> Open full clinician guide</a><p className="sheet-footnote">Verify current U.S. prescribing information and patient-specific renal/hepatic adjustments before ordering.</p>
    </section></div>}

    {installOpen && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setInstallOpen(false)}><section className="install-sheet" role="dialog" aria-modal="true" aria-label="Add to phone">
      <button className="sheet-close" onClick={() => setInstallOpen(false)} aria-label="Close"><X size={20} /></button><div className="install-icon"><Download size={27} /></div><span className="eyebrow">PHONE SETUP</span><h2>Keep MedPath one tap away</h2>
      {isAppleMobile ? <ol><li><b>Open this site in Safari</b><span>Use the private production link on your iPhone or iPad.</span></li><li><b>Tap the Share button</b><span>Scroll and choose “Add to Home Screen.”</span></li><li><b>Tap Add</b><span>MedPath will open from its own home-screen icon.</span></li></ol>
      : isAndroid ? <ol><li><b>Open the Chrome menu</b><span>Tap the three dots in the upper-right corner.</span></li><li><b>Choose “Install app”</b><span>Some devices label this “Add to Home screen.”</span></li><li><b>Confirm Install</b><span>MedPath will appear with your Android apps.</span></li></ol>
      : <ol><li><b>Open the browser menu</b><span>In Chrome, use the install icon in the address bar or “Install GI MedPath.”</span></li><li><b>In Microsoft Edge</b><span>Choose Apps → Install GI MedPath Pocket Guide.</span></li><li><b>Confirm Install</b><span>It opens in its own window and can be pinned to Start, the taskbar, or the macOS Dock.</span></li></ol>}
      <Signal label="Privacy">Do not enter patient identifiers. Calculator inputs stay in this browser session and are not retained.</Signal>
    </section></div>}
  </main>;
}
