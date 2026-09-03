# GI MedPath Pocket Guide

A responsive, installable clinician quick-reference for inflammatory bowel disease, hepatitis C, hepatitis B, medication safety, monitoring, and common GI/hepatology risk calculators.

## Open or install the app

**Public app:** https://gi-medpath-pocket.sanjayja.chatgpt.site

- **iPhone/iPad:** open the public app in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** open it in Chrome, open the browser menu, then choose **Install app** or **Add to Home screen**.
- **Windows/macOS:** open it in Chrome or Edge and use the install icon in the address bar or the browser's **Apps → Install** command.

The app is a progressive web app (PWA). Recipients do not need access to this private repository and do not need to download an executable or mobile-app package.

## Included clinical content

- IBD biologic and advanced-therapy pathway
- Hepatitis C evaluation and treatment pathway
- Hepatitis B evaluation and treatment pathway
- Drug dosing, positioning, safety warnings, and monitoring prompts
- MELD 3.0
- Child–Pugh
- Maddrey discriminant function
- Lille score
- FIB-4
- APRI
- PAGE-B
- Glasgow-Blatchford score
- BISAP

Calculator inputs are processed locally in the browser and are not retained. Do not enter patient identifiers.

## Medical-use notice

This application is educational decision support for qualified clinicians. It is not a diagnostic device and is not a substitute for current prescribing information, live professional guidelines, an interaction checker, local protocols, consultation, or patient-specific clinical judgment. Verify calculations and recommendations against the primary sources linked within the application before acting.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Validation:

```bash
npm run lint
npm run build
```

## Main project files

- `app/page.tsx` — primary application interface
- `app/content.ts` — pathways, medicines, monitoring, and references
- `app/calculators.tsx` — GI and hepatology calculators
- `app/globals.css` — responsive styling
- `public/manifest.webmanifest` — installable-app metadata
- `public/sw.js` — offline-aware service worker

## Privacy

The current application has no patient database, analytics tracker, or server-side storage for calculator values. Keep protected health information out of calculator fields and source-control history.
