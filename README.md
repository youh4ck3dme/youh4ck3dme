# RiggedGuard Rampage React

RiggedGuard Rampage React is an aggressive—but ethical—casino game forensic testing PWA. It fuses neon casino visuals with deep browser probes to spot manipulated HTML5 games, tampered runtimes, hostile proxies, and covert network peers. Every scan is passive: no exploits, just telemetry to help compliance teams keep the tables honest.

---

## 🎯 Objective
- Validate whether a mobile WebView or browser session is running a clean, untampered casino experience.
- Surface anomalies across TLS, JavaScript runtime integrity, DevTools activity, static asset hashes, and WebRTC topology.
- Deliver the findings inside a self-hosted, offline-ready React PWA that respects a strict Content Security Policy.

---

## 🏗️ Architecture Overview
| Layer | What it does |
| --- | --- |
| **React Shell (`src/App.jsx`)** | Orchestrates scans, renders casino-themed detector cards, and streams telemetry events. |
| **Detector Hook (`src/hooks/useDetectors.js`)** | Runs asynchronous probes for each module, maintains status, logs, trivia popups, and export helpers. |
| **Module Cards (`src/components/detectors/*.jsx`)** | Dedicated UI for every forensic module (slot reels, roulette wheel, neon runtime grid, poker hand, bouncer, spyglass radar). |
| **PWA Shell (`index.html`, `public/service-worker.js`, `public/manifest.webmanifest`)** | CSP-locked HTML shell, offline cache, runtime hash verification, and install metadata. |
| **Telemetry + Controls (`src/components/*.jsx`)** | Control panel for full scans/exports, live log stream, and casino trivia pop-up to keep operators engaged. |

---

## 🔍 Detection Modules
1. **WebView & WebKit Intrusion Hunter**  
   Looks for user-agent `wv` tokens, exposed WebKit bridges, and suspicious globals such as `ReactNativeWebView`. Slot-machine visuals highlight anomalies.

2. **MITM & TLS Exploit Radar**  
   Fires controlled probes against `self-signed.badssl.com` to sniff failed TLS handshakes and latency spikes that hint at proxies. Results animate through a roulette wheel.

3. **JavaScript Hook & Runtime Monitor**  
   Validates that `fetch`, `console.log`, and storage descriptors still appear native, flagging Proxy tampering. Neon LED tiles flicker with status.

4. **DevTools Intrusion Detector**  
   Combines viewport-gap heuristics with debugger timing checks and `navigator.webdriver`. Poker cards flip to expose watchers.

5. **Resource & Integrity Verifier**  
   Uses SHA-256 to hash cached assets (HTML, manifest, offline shell, service worker). The service worker and UI both escalate if hashes deviate. Visualized as a nightclub bouncer at the velvet rope.

6. **WebRTC & Network Spyglass**  
   Negotiates a local peer connection, inspects ICE candidates, and flags relay-only or missing private IP entries. The spyglass console glows with STUN intel.

Each module reports a status (`idle`, `running`, `pass`, `warning`, `alert`) and streams details to the telemetry log for audit trails.

---

## 🖥️ UI & Gameplay Notes
- Dark neon casino theme (`src/styles.css`) with slot reels, roulette animations, poker flips, siren lights, and radar sweeps.
- **Control buttons:** Run Full Scan, export JSON/CSV reports, and clear logs.
- **Telemetry stream:** Timestamped log with severity coloring and module tags.
- **Casino trivia:** Random facts appear during long scans (e.g., Monte Carlo magnets, Macau dice swaps) to keep analysts entertained.
- Fully responsive down to phone breakpoints.

---

## 🧰 Setup & Scripts
```bash
npm install
npm run dev      # Vite dev server with hot reload
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview the production bundle
```

After building, host the contents of `dist/` on any static server (e.g., `npx serve dist`, `python3 -m http.server`).

---

## 📱 PWA Behavior
- `index.html` enforces CSP: `default-src 'self'` and allows BadSSL images/connects only for the TLS radar.
- `public/manifest.webmanifest` defines name, theme color (#00ffa3), start URL, and embedded SVG icons.
- `public/service-worker.js` precaches the shell, offers an offline fallback (`public/offline.html`), and verifies cached assets against `public/integrity-manifest.json` (SHA-256, Base64).
- Service worker messages feed back into the Integrity Verifier module for real-time tamper alerts.

---

## 🔐 Security & Ethics
- Passive detection only—no exploitation or unauthorized tampering.
- Hash verification + CSP defend against injected scripts or CDN drift.
- Exported telemetry keeps auditors and compliance teams in sync.
- Use RiggedGuard Rampage React only in environments where you have authorization to audit casino games or platforms.

---

## 📝 Reports & Telemetry
- Export telemetry as **JSON** or **CSV** via the control panel.
- Logs roll automatically (200 entry buffer) and include timestamp, module label, severity, and message text.
- Integrity alerts from the service worker are piped straight to the UI with expected vs. observed hash values.

---

## 🎰 Casino Trivia Sampler
RiggedGuard includes pop-ups with nuggets such as:
- Monte Carlo roulette magnets of 1842—the birth of forensic sweeps.
- Vegas sportsbooks pairing humans with AI “line readers.”
- Macau’s infrared dice-tracking sting operations.
- Atlantic City slot firmware hashing every spin.

They are there for morale while long probes run—feel free to extend the list in `useDetectors.js`.

---

## 🗺️ File Map Highlights
```
index.html                 # CSP-locked SPA entry
src/App.jsx                # React orchestration shell
src/styles.css             # Neon casino theme + animations
src/hooks/useDetectors.js  # Detection logic & telemetry state
src/components/            # Detector cards, telemetry log, controls, trivia popup
public/service-worker.js   # Caching + integrity verification + messaging
public/manifest.webmanifest# Install metadata with inline icons
public/offline.html        # Offline fallback screen
public/integrity-manifest.json # SHA-256 fingerprints verified at runtime
```

---

Happy scanning, and keep the house fair! 🃏
