export type ModuleKey = "ibd" | "hcv" | "hbv";

export type Drug = {
  module: ModuleKey;
  generic: string;
  brand: string;
  drugClass: string;
  use: string;
  dose: string;
  role: string;
  warnings: string[];
  monitoring: string[];
  search?: string;
};

export type PathStep = {
  kicker: string;
  question: string;
  yes: string;
  no?: string;
  tone?: "danger" | "amber" | "teal";
};

export const modules = {
  ibd: {
    short: "IBD",
    title: "Advanced IBD therapy",
    subtitle: "Phenotype, safety, positioning, dosing",
    color: "#167d76",
    guide: "/guides/IBD_Advanced_Therapy_Pathway_2026.docx",
  },
  hcv: {
    short: "HCV",
    title: "Hepatitis C treatment",
    subtitle: "Pangenotypic treatment, DDI, salvage",
    color: "#345995",
    guide: "/guides/Hepatitis_C_Treatment_Pathway_2026.docx",
  },
  hbv: {
    short: "HBV",
    title: "Hepatitis B management",
    subtitle: "Treat, monitor, pregnancy, reactivation",
    color: "#735c9d",
    guide: "/guides/Hepatitis_B_Management_Pathway_2026.docx",
  },
} as const;

export const hardStops: Record<ModuleKey, { title: string; body: string }> = {
  ibd: {
    title: "Safety override",
    body: "Emergency features, uncontrolled infection, abscess, obstruction, perforation, or acute severe UC override routine outpatient sequencing. Stabilize, obtain source control, use rescue therapy when appropriate, and involve surgery early.",
  },
  hcv: {
    title: "No protease inhibitor in decompensation",
    body: "Never use an NS3 protease inhibitor (a ‘-previr,’ including glecaprevir or voxilaprevir) with Child–Turcotte–Pugh B/C, current hepatic decompensation, or any prior decompensation history.",
  },
  hbv: {
    title: "Decompensated HBV",
    body: "Start antiviral therapy promptly, coordinate transplant-center care, and do not use peginterferon. Do not wait for ALT elevation.",
  },
};

export const pathways: Record<ModuleKey, PathStep[]> = {
  ibd: [
    {
      kicker: "1 · Override",
      question: "Emergency, uncontrolled infection, abscess, obstruction, perforation, or ASUC?",
      yes: "Stabilize; exclude/treat infection; drain abscess or relieve obstruction; activate rescue/surgical pathway.",
      no: "Confirm objective inflammation, severity, phenotype, prior mechanisms, EIMs, pregnancy plans, infection risk, and route preference.",
      tone: "danger",
    },
    {
      kicker: "2 · Phenotype",
      question: "Acute severe UC or perianal fistulizing Crohn’s disease?",
      yes: "ASUC: IV corticosteroids; if inadequate response, infliximab or calcineurin rescue with early colectomy planning and day-3 reassessment. Perianal CD: pelvic MRI/EUS, drain sepsis, seton when appropriate; infliximab has strongest randomized evidence.",
      no: "Position an advanced therapy by efficacy, safety, prior mechanism, speed, EIMs, age/frailty, malignancy history, logistics, and patient preference.",
      tone: "amber",
    },
    {
      kicker: "3 · Reassessment",
      question: "Objective response by end of induction (about 8–16 weeks)?",
      yes: "Continue toward steroid-free remission; monitor CRP/fecal calprotectin and assess objective healing, often within 6–12 months after a major change.",
      no: "Confirm adherence and active inflammation. For anti-TNF, use reactive TDM to distinguish low exposure/immunogenicity from mechanistic failure; optimize or switch accordingly.",
      tone: "teal",
    },
  ],
  hcv: [
    {
      kicker: "1 · Confirm",
      question: "Detectable HCV RNA?",
      yes: "Stage fibrosis and liver function; determine prior treatment, CTP status, HBV/HIV, pregnancy, eGFR, and the complete medication list.",
      no: "Reactive antibody with undetectable RNA means no current infection. Use RNA—not repeat antibody—to evaluate reinfection.",
      tone: "teal",
    },
    {
      kicker: "2 · Liver gate",
      question: "Current/prior decompensation or CTP ≥7?",
      yes: "No NS3 protease inhibitor. Refer to experienced hepatology/transplant care. If ribavirin eligible: Epclusa (sofosbuvir/velpatasvir) + weight-based ribavirin for 12 weeks; if not, Epclusa for 24 weeks.",
      no: "If treatment-naïve and otherwise eligible, continue to the simplified no-cirrhosis or compensated-cirrhosis branch.",
      tone: "danger",
    },
    {
      kicker: "3 · Select",
      question: "No cirrhosis or compensated CTP A cirrhosis?",
      yes: "After DDI review: Mavyret (glecaprevir/pibrentasvir) 300/120 mg with food for 8 weeks, or Epclusa (sofosbuvir/velpatasvir) 400/100 mg for 12 weeks. For compensated genotype 3 using Epclusa, assess Y93H.",
      no: "Prior DAA treatment, HBsAg positivity, pregnancy, known/suspected HCC, transplant, and other exclusions require the full guidance pathway.",
      tone: "teal",
    },
    {
      kicker: "4 · Cure",
      question: "HCV RNA undetectable ≥12 weeks after the last dose?",
      yes: "SVR12/cure. If cirrhosis, continue ultrasound + AFP about every 6 months; if ongoing risk, check RNA at least annually.",
      no: "Distinguish relapse from reinfection and plan retreatment by the exact failed regimen.",
      tone: "teal",
    },
  ],
  hbv: [
    {
      kicker: "1 · Stage",
      question: "HBsAg-positive chronic HBV with cirrhosis/decompensation and detectable DNA?",
      yes: "Treat regardless of ALT. For decompensation use Baraclude (entecavir) or Viread (TDF); no peginterferon; coordinate transplant-aware care.",
      no: "Assess immune-active thresholds, fibrosis/inflammation, pregnancy, HIV/HDV/HCV, immunosuppression, and prior antiviral exposure.",
      tone: "danger",
    },
    {
      kicker: "2 · Conventional indication",
      question: "Immune-active disease?",
      yes: "Treat if HBeAg positive with DNA ≥20,000 IU/mL and ALT ≥2× ULN, or HBeAg negative with DNA ≥2,000 IU/mL and ALT ≥2× ULN.",
      no: "Treat with ≥F2 fibrosis or at least grade 2 inflammation. Otherwise continue to special indications and expanded-risk categories.",
      tone: "teal",
    },
    {
      kicker: "3 · Overrides",
      question: "Pregnancy DNA >200,000; HBV/HIV; high-risk immunosuppression; extrahepatic HBV; age ≥40 immune-tolerant; or HBeAg-negative indeterminate disease?",
      yes: "Treat or use the dedicated shared-decision pathway. Pregnancy: start Viread (TDF) or Vemlidy (TAF) at week 28; newborn vaccine + HBIG within 12 hours.",
      no: "Classify phase and monitor ALT/DNA at the phase-specific interval; reassess fibrosis, HCC risk, pregnancy, immunosuppression, and preferences.",
      tone: "amber",
    },
    {
      kicker: "4 · Duration",
      question: "Considering nucleos(t)ide analogue withdrawal before HBsAg loss?",
      yes: "Default is do not stop. Never stop routinely with cirrhosis, decompensation, HCC, extrahepatic HBV, HIV, or HDV. Highly selected stopping requires HBV-specialist shared decision-making and intensive monitoring.",
      no: "Continue potent high-barrier therapy and monitor HBV DNA, ALT, renal/bone risk, adherence, and HCC surveillance indications.",
      tone: "danger",
    },
  ],
};

export const drugs: Drug[] = [
  {
    module: "ibd", generic: "Infliximab", brand: "Remicade; biosimilars; Zymfentra", drugClass: "Anti-TNF", use: "Crohn’s disease, ulcerative colitis",
    dose: "IV 5 mg/kg at weeks 0, 2, and 6, then every 8 weeks. Zymfentra: 120 mg SC every 2 weeks starting week 10 after IV induction.",
    role: "Severe disease, ASUC rescue, and perianal/fistulizing CD. Combination immunomodulator therapy may reduce immunogenicity in selected patients.",
    warnings: ["Serious/opportunistic infection; TB/HBV reactivation", "Demyelination and worsening moderate–severe heart failure", "Infusion reaction, immunogenicity, lupus-like reaction; malignancy/skin-cancer signal"],
    monitoring: ["TB and HBV before treatment", "CBC/CMP and infection review", "Reactive therapeutic drug monitoring for active disease or loss of response"],
  },
  {
    module: "ibd", generic: "Adalimumab", brand: "Humira; biosimilars", drugClass: "Anti-TNF", use: "Crohn’s disease, ulcerative colitis",
    dose: "160 mg SC day 1, 80 mg day 15, then 40 mg every other week beginning day 29.", role: "Self-injected anti-TNF option; reactive drug and antibody levels can clarify loss of response.",
    warnings: ["Serious/opportunistic infection; TB/HBV reactivation", "Demyelination, advanced heart failure, injection reactions", "Malignancy and skin-cancer signal; higher lymphoma concern with thiopurine combination"],
    monitoring: ["TB/HBV and vaccines", "CBC/CMP and infection review", "Reactive TDM when response is lost"],
  },
  {
    module: "ibd", generic: "Certolizumab pegol", brand: "Cimzia", drugClass: "Anti-TNF", use: "Crohn’s disease",
    dose: "400 mg SC at weeks 0, 2, and 4, then every 4 weeks.", role: "Fc-free anti-TNF; generally not a preferred first option when stronger comparative choices are available.",
    warnings: ["Anti-TNF serious infection and reactivation risks", "Demyelination and heart-failure precautions"], monitoring: ["TB/HBV screening", "CBC/CMP, infection and preventive-care review"],
  },
  {
    module: "ibd", generic: "Golimumab", brand: "Simponi", drugClass: "Anti-TNF", use: "Ulcerative colitis",
    dose: "200 mg SC week 0, 100 mg week 2, then 100 mg every 4 weeks.", role: "Convenient monthly anti-TNF option for UC.",
    warnings: ["Anti-TNF serious infection and reactivation risks", "Demyelination and heart-failure precautions"], monitoring: ["TB/HBV screening", "CBC/CMP, infection and preventive-care review"],
  },
  {
    module: "ibd", generic: "Vedolizumab", brand: "Entyvio", drugClass: "Integrin antagonist", use: "Crohn’s disease, ulcerative colitis",
    dose: "300 mg IV at weeks 0, 2, and 6, then every 8 weeks; 108 mg SC every 2 weeks after IV induction per label.", role: "Gut-selective option with favorable systemic safety profile; slower onset can matter in severe disease.",
    warnings: ["Infusion/hypersensitivity reactions and infection", "Uncommon liver injury"], monitoring: ["Vaccines and infection screening", "CBC/CMP and objective IBD markers"],
  },
  {
    module: "ibd", generic: "Ustekinumab", brand: "Stelara; biosimilars", drugClass: "IL-12/23 antagonist", use: "Crohn’s disease, ulcerative colitis",
    dose: "Single weight-tiered IV induction (~6 mg/kg: 260/390/520 mg), then 90 mg SC 8 weeks later and every 8 weeks.", role: "Favorable efficacy/safety balance; useful after anti-TNF failure and with psoriasis/psoriatic disease.",
    warnings: ["Infection and hypersensitivity", "Rare PRES reports; nonmelanoma skin-cancer signal"], monitoring: ["TB assessment and vaccines", "CBC/CMP and disease markers"],
  },
  {
    module: "ibd", generic: "Risankizumab", brand: "Skyrizi", drugClass: "Selective IL-23 antagonist", use: "Crohn’s disease, ulcerative colitis",
    dose: "CD: 600 mg IV weeks 0, 4, 8. UC: 1,200 mg IV weeks 0, 4, 8. Both: 180 or 360 mg SC at week 12 and every 8 weeks.", role: "Strong evidence in anti-TNF-exposed CD; SEQUENCE showed superior endoscopic remission versus ustekinumab.",
    warnings: ["Infection and hypersensitivity", "Liver-enzyme elevation and rare drug-induced liver injury"], monitoring: ["TB and vaccination review", "Liver enzymes/bilirubin before treatment and during induction"],
  },
  {
    module: "ibd", generic: "Guselkumab", brand: "Tremfya", drugClass: "Selective IL-23 antagonist", use: "Crohn’s disease, ulcerative colitis",
    dose: "200 mg IV or 400 mg SC at weeks 0, 4, 8. Then 100 mg SC at week 16 and every 8 weeks, or 200 mg at week 12 and every 4 weeks.", role: "Selective IL-23 option with IV or fully SC induction.",
    warnings: ["Infection and hypersensitivity", "Liver-enzyme elevation and drug-induced liver injury concern"], monitoring: ["TB and vaccination review", "Liver tests at baseline, through at least week 16, then periodically"],
  },
  {
    module: "ibd", generic: "Mirikizumab", brand: "Omvoh", drugClass: "Selective IL-23 antagonist", use: "Crohn’s disease, ulcerative colitis",
    dose: "UC: 300 mg IV weeks 0, 4, 8; 200 mg SC week 12 then every 4 weeks. CD: 900 mg IV weeks 0, 4, 8; 300 mg SC week 12 then every 4 weeks.", role: "Indication-specific selective IL-23 dosing.",
    warnings: ["Infection and hypersensitivity", "Liver-enzyme elevation and drug-induced liver injury concern"], monitoring: ["TB and vaccination review", "Baseline and label-directed liver monitoring"],
  },
  {
    module: "ibd", generic: "Tofacitinib", brand: "Xeljanz / Xeljanz XR", drugClass: "JAK inhibitor", use: "Ulcerative colitis",
    dose: "10 mg twice daily (XR 22 mg daily) for at least 8 weeks; assess and, if needed, extend to 16 weeks. Maintenance 5 mg twice daily (XR 11 mg daily); higher maintenance only selectively and briefly.", role: "Rapid oral therapy; U.S. indication after TNF-blocker inadequate response/intolerance.",
    warnings: ["Boxed: serious infection, mortality, malignancy, MACE, thrombosis", "Herpes zoster, cytopenias, lipid/LFT elevation, GI perforation, fetal risk"], monitoring: ["TB/HBV and Shingrix when possible", "CBC, hemoglobin, LFTs, lipids", "Assess age ≥50, smoking, ASCVD and VTE risk"],
  },
  {
    module: "ibd", generic: "Upadacitinib", brand: "Rinvoq", drugClass: "JAK inhibitor", use: "Crohn’s disease, ulcerative colitis",
    dose: "UC: 45 mg daily for 8 weeks. CD: 45 mg daily for 12 weeks. Maintenance 15 mg daily; 30 mg may be considered for refractory, severe, or extensive disease; use the lowest effective dose.", role: "Rapid, high-efficacy oral option in many biologic-exposed patients.",
    warnings: ["Boxed: serious infection, mortality, malignancy, MACE, thrombosis", "Herpes zoster, cytopenias, lipid/LFT elevation, GI perforation, fetal risk"], monitoring: ["TB/HBV and Shingrix when possible", "CBC, hemoglobin, LFTs, lipids", "Assess smoking, ASCVD and VTE risk; interaction review"],
  },
  {
    module: "ibd", generic: "Ozanimod", brand: "Zeposia", drugClass: "S1P modulator", use: "Ulcerative colitis",
    dose: "7-day titration: 0.23 mg daily days 1–4; 0.46 mg days 5–7; 0.92 mg daily from day 8.", role: "Oral option without biologic immunogenicity.",
    warnings: ["Bradycardia/AV conduction delay", "Lymphopenia/infection, macular edema, liver injury, hypertension, pulmonary effects, fetal risk"], monitoring: ["CBC, LFTs, ECG/cardiac and medication review", "VZV immunity; eye assessment when indicated", "Blood pressure and skin surveillance"],
  },
  {
    module: "ibd", generic: "Etrasimod", brand: "Velsipity", drugClass: "S1P modulator", use: "Ulcerative colitis",
    dose: "2 mg orally once daily; no titration.", role: "Once-daily oral S1P1/4/5 modulator.",
    warnings: ["Bradycardia/AV conduction delay", "Lymphopenia/infection, macular edema, liver injury, hypertension, pulmonary effects, fetal risk"], monitoring: ["CBC, ECG/cardiac review and liver tests", "Eye-risk assessment, skin examination, medication/vaccine review"],
  },
  {
    module: "hcv", generic: "Glecaprevir / pibrentasvir", brand: "Mavyret", drugClass: "NS3/4A PI + NS5A inhibitor", use: "Treatment-naïve genotypes 1–6; selected retreatment",
    dose: "300/120 mg (three tablets together) once daily with food for 8 weeks in eligible treatment-naïve adults without cirrhosis or with compensated CTP A cirrhosis.", role: "Short-course pangenotypic regimen; permitted without DAA dose adjustment in renal failure/dialysis.",
    warnings: ["Contraindicated in CTP B/C or any history of hepatic decompensation", "Important transporter/CYP interactions; rifampin and atazanavir contraindicated", "Products containing >20 micrograms ethinyl estradiol are not recommended"], monitoring: ["Full DDI check before prescribing", "Hepatic panel, CBC, eGFR and HBV status", "HCV RNA ≥12 weeks after treatment"],
  },
  {
    module: "hcv", generic: "Sofosbuvir / velpatasvir", brand: "Epclusa", drugClass: "NS5B nucleotide + NS5A inhibitor", use: "Genotypes 1–6; including specialist decompensated pathway",
    dose: "400/100 mg once daily for 12 weeks in eligible treatment-naïve adults. Decompensated: add weight-based ribavirin for 12 weeks if eligible; otherwise 24 weeks without ribavirin.", role: "One-tablet pangenotypic regimen; usable in decompensated disease through the specialist pathway.",
    warnings: ["Amiodarone-associated serious symptomatic bradycardia: not recommended", "Velpatasvir absorption decreases with acid suppression", "Strong inducers including rifampin, carbamazepine, phenytoin, phenobarbital and St John’s wort should be avoided"], monitoring: ["Live DDI check", "If compensated genotype 3: Y93H assessment", "HCV RNA ≥12 weeks after treatment"],
  },
  {
    module: "hcv", generic: "Sofosbuvir / velpatasvir / voxilaprevir", brand: "Vosevi", drugClass: "NS5B + NS5A + NS3/4A PI", use: "DAA retreatment",
    dose: "400/100/100 mg once daily with food for 12 weeks for most prior sofosbuvir-based failures; regimen and ribavirin additions depend on failed therapy, genotype, and cirrhosis.", role: "Principal salvage regimen; not routine first-line therapy.",
    warnings: ["No use with current/prior decompensation or CTP B/C", "Amiodarone not recommended; substantial DDI burden", "Rifampin contraindicated; strong inducers not recommended"], monitoring: ["Verify exact failed regimen and adherence", "Full DDI and cirrhosis review", "Specialist input for complex/multiple failures"],
  },
  {
    module: "hbv", generic: "Entecavir", brand: "Baraclude", drugClass: "Nucleoside analogue", use: "Chronic hepatitis B",
    dose: "0.5 mg orally daily; 1 mg daily with lamivudine resistance or decompensated disease. Take on an empty stomach (≥2 hours after and ≥2 hours before food). Adjust if CrCl <50 mL/min.", role: "Preferred high-barrier oral therapy in nucleos(t)ide-naïve disease; renal-adjusted option when tenofovir is unsuitable.",
    warnings: ["Resistance barrier falls substantially after lamivudine resistance", "Test for HIV; never use as inadequate HIV therapy", "Severe post-treatment HBV flare; rare lactic acidosis, especially in advanced liver disease"], monitoring: ["HBV DNA and ALT", "Renal function for dose adjustment", "HIV status, adherence, and post-stop flare if therapy changes"],
  },
  {
    module: "hbv", generic: "Tenofovir disoproxil fumarate", brand: "Viread (TDF)", drugClass: "Nucleotide analogue", use: "Chronic hepatitis B; pregnancy; HBV/HIV as part of ART",
    dose: "300 mg orally daily. CrCl 30–49: every 48 hours; 10–29: every 72–96 hours; hemodialysis: every 7 days/after about 12 hours dialysis.", role: "Preferred high-barrier therapy with the most pregnancy efficacy/safety data; active against lamivudine-resistant HBV.",
    warnings: ["Renal tubular toxicity and bone mineral-density loss", "Severe post-treatment HBV flare", "For HIV, use only within fully suppressive ART with FTC or 3TC"], monitoring: ["Creatinine/CrCl and urine glucose/protein", "Phosphate in CKD; bone risk", "HBV DNA, ALT and adherence"],
  },
  {
    module: "hbv", generic: "Tenofovir alafenamide", brand: "Vemlidy (TAF)", drugClass: "Nucleotide analogue", use: "Chronic hepatitis B; pregnancy; HBV/HIV as part of ART",
    dose: "25 mg orally daily with food. No adjustment with eCrCl ≥15; may use in ESRD on chronic hemodialysis after dialysis. Not recommended in ESRD without hemodialysis.", role: "Preferred high-barrier therapy with less renal/bone effect than TDF; accepted by 2025 AASLD/IDSA in pregnancy, though TDF has more data.",
    warnings: ["Not recommended in decompensated Child–Pugh B/C disease", "Severe post-treatment HBV flare", "For HIV, use only within fully suppressive ART with FTC or 3TC"], monitoring: ["Creatinine/CrCl and urine glucose/protein", "Phosphate in CKD", "HBV DNA, ALT and adherence"],
  },
  {
    module: "hbv", generic: "Peginterferon alfa-2a", brand: "Pegasys", drugClass: "Pegylated interferon", use: "Selected compensated chronic hepatitis B",
    dose: "180 micrograms SC weekly for 48 weeks; 135 micrograms weekly in ESRD per label.", role: "Rare finite-course option for carefully selected compensated patients.",
    warnings: ["Contraindicated in hepatic decompensation and pregnancy", "Cytopenias, depression/suicidality, autoimmune/thyroid and ocular toxicity", "Flu-like effects, infection and hepatic flare"], monitoring: ["CBC, liver tests, thyroid and psychiatric assessment", "HBV DNA/serologic response", "Clinical toxicity throughout the finite course"],
  },
];

export const monitorCards: Record<ModuleKey, { title: string; items: string[] }[]> = {
  ibd: [
    { title: "Before first dose", items: ["CBC, renal/liver profile, CRP/fecal calprotectin", "TB and HBV; vaccines; pregnancy/contraception when relevant", "Class-specific ECG, eye, lipid, VZV or malignancy-risk review"] },
    { title: "Treat to target", items: ["Early review at 2–8 weeks", "End-of-induction symptoms + biomarkers at 8–16 weeks", "Objective healing assessment often 6–12 months after a major therapy change"] },
    { title: "Stable disease", items: ["Clinical status, steroid exposure, adherence, CBC/CMP, CRP/FCP every 3–6 months as appropriate", "Annual vaccines, skin/cervical/colorectal surveillance, bone/nutrition/mental health and CV/VTE risk"] },
  ],
  hcv: [
    { title: "Pretreatment", items: ["HCV RNA, CBC, hepatic panel, eGFR; INR if advanced disease", "FIB-4/elastography and CTP; prior regimen", "HBsAg, anti-HBc, anti-HBs; HIV; pregnancy; full DDI check"] },
    { title: "On treatment", items: ["Adherence and new-medication interaction review", "Monitor clinically/laboratory testing when comorbidity, cirrhosis, ribavirin, or regimen requires", "HBV prophylaxis or HBV DNA monitoring when HBsAg positive"] },
    { title: "After treatment", items: ["HCV RNA + hepatic panel ≥12 weeks after last dose", "Cirrhosis: ultrasound + AFP about every 6 months", "Ongoing reinfection risk: RNA at least annually"] },
  ],
  hbv: [
    { title: "Untreated phases", items: ["Immune tolerant: ALT/DNA every 6 months", "HBeAg-positive indeterminate: every 3–6 months", "HBeAg-negative indeterminate: every 3 months in year 1, then about every 6 months", "Inactive CHB: every 3–6 months in year 1, then every 6–12 months"] },
    { title: "On nucleos(t)ide therapy", items: ["HBV DNA, ALT, adherence and serologic status", "Renal/urine/phosphate monitoring by agent and CKD risk", "HCC surveillance remains risk-based despite viral suppression"] },
    { title: "HCC surveillance", items: ["Ultrasound + AFP every 6 months when indicated", "Includes cirrhosis, specified endemic-origin ages, family HCC, PAGE-B ≥10 on treatment, all adult HBV/HDV, and guideline-defined HBV/HIV groups"] },
  ],
};

export const sources: Record<ModuleKey, { label: string; href: string }[]> = {
  ibd: [
    { label: "AGA Living Guideline · UC", href: "https://www.gastrojournal.org/article/S0016-5085(24)00556-3/fulltext" },
    { label: "AGA Living Guideline · Crohn’s disease", href: "https://www.gastrojournal.org/article/S0016-5085(25)00609-1/fulltext" },
    { label: "Full clinician guide (.docx)", href: "/guides/IBD_Advanced_Therapy_Pathway_2026.docx" },
  ],
  hcv: [
    { label: "AASLD/IDSA HCV Guidance", href: "https://www.hcvguidelines.org/" },
    { label: "Liverpool HEP interaction checker", href: "https://www.hep-druginteractions.org/checker" },
    { label: "Full clinician guide (.docx)", href: "/guides/Hepatitis_C_Treatment_Pathway_2026.docx" },
  ],
  hbv: [
    { label: "AASLD Hepatitis B guidance", href: "https://www.aasld.org/practice-guidelines/hepatitis-b" },
    { label: "CDC perinatal HBV prevention", href: "https://www.cdc.gov/hepatitis-b/hcp/perinatal-provider-overview/index.html" },
    { label: "Full clinician guide (.docx)", href: "/guides/Hepatitis_B_Management_Pathway_2026.docx" },
  ],
};
