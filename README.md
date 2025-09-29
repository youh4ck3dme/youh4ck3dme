# Firebyte Mobile Threat Hunter

## Objective
- Provide a guided interface and CLI automation to audit iOS devices for jailbreak traces, malicious code, SIM tampering, and integrity drift.
- Deliver actionable alerts (terminal output and email hooks) so operators can react quickly while keeping QA observers informed.
- Package the experience as a lightweight PWA-style dashboard that mirrors casino-floor surveillance energy—complete with quick wins, rapid pivots, and a bit of high-stakes trivia flair.

## Architecture Overview
### Module Breakdown
- **React UI Shell** (`src/`): `App.jsx` handles the login gate, `LoginPage.jsx` offers credential capture for role-play testing, and `LandingPage.jsx` renders the Firebyte insignia with parallax motion for immersive operator presence.
- **iOS Security Analyser** (`ios_security_analyser.sh`): Nine-entry menu orchestrating discrete detection modules, optional report export, and reusable email alert helper.
- **Build Tooling**: Vite + React 19 with Tailwind CSS utilities for styling; npm scripts provide dev server, production build, and preview server pathways.

### Detector Logic Snapshot
1. System Recon surfaces OS and kernel fingerprints for baseline comparison.
2. Jailbreak Sentinel inspects high-signal filesystem artifacts and triggers email if compromised.
3. Process Sweeper scans active tasks for well-known jailbreak daemons (Frida, checkra1n, etc.).
4. Log Forensics filters recent system logs for failed auths and exploit keywords.
5. Integrity Guardian queries `csrutil` to ensure System Integrity Protection remains intact.
6. Application Signature Inspector strings executable payloads for malware keywords and escalates via email if tripped.
7. SIM Manipulation Watcher lists installed eSIM profiles and history artefacts.
8. Report Exporter aggregates recon + logs, saves to `~/Analyse_Logs/security_report.log`, and emails stakeholders.
9. Exit provides controlled termination for scripted runs.

### PWA Flow
1. **Launch** – Vite-served bundle prompts for credentials (password optional for QA walkthroughs).
2. **Authenticate** – Successful submit toggles state in `App.jsx`, unlocking the command deck.
3. **Command Deck** – `LandingPage.jsx` displays the insignia with device-aware parallax; operators consult README + script to run detections while UI remains available as a quick status canvas.
4. **Install Prompt (optional)** – Modern browsers can install the site as an app; offline experience is static visual branding pending network reconnection for script execution.

> 🎰 *Casino Trivia Interlude*: The Monte Carlo Casino once banned locals, ensuring tourists carried the odds—much like our toolkit keeps adversaries playing the house’s game.

## Detection Modules (Methodology, Alerts, Limitations)
### 1. System Recon
- **Methodology**: Executes `uname -a` and `sw_vers` to capture kernel, device, and OS build metadata.
- **Expected Alerts**: Console output only; no automated escalation.
- **Limitations**: Requires shell access with permissions to query OS metadata; no historical baseline comparison built in.

### 2. Jailbreak Sentinel
- **Methodology**: Checks for tell-tale paths (`/private/var/lib/apt/`, `Cydia.app`, `/bin/bash`).
- **Expected Alerts**: Prints warning banner and invokes `send_email_alert` for rapid operator notification.
- **Limitations**: Advanced jailbreaks may hide artifacts; containerized scans may produce false negatives without full filesystem access.

> 🎲 *Casino Trivia Boost*: Roulette wheels total 666 across all numbers—a reminder that anomalies love leaving numerical fingerprints.

### 3. Process Sweeper
- **Methodology**: Runs `ps aux` and greps for suspicious daemons (`sshd`, `Dropbear`, `frida`, `checkra1n`, `unc0ver`).
- **Expected Alerts**: Console listing of matches for manual triage.
- **Limitations**: Obfuscated process names and short-lived payloads can evade detection; requires `ps` visibility into target namespaces.

### 4. Log Forensics Scanner
- **Methodology**: `log show --last 1h` filtered for strings like `Failed`, `Error`, `denied`, `exploit`, `hack`.
- **Expected Alerts**: Terminal output for hits; operators escalate manually based on context.
- **Limitations**: Log retention policies may truncate evidence; noisy environments need additional parsing logic to prioritize severity.

### 5. Integrity Guardian
- **Methodology**: Calls `csrutil status` to validate System Integrity Protection.
- **Expected Alerts**: Console status message.
- **Limitations**: SIP queries require macOS context; jailbroken environments may spoof results.

### 6. Application Signature Inspector
- **Methodology**: Iterates `/Applications/*.app`, locates executable binaries, runs `strings`, and matches against keywords (`malware`, `trojan`, `backdoor`, `keylogger`, `spyware`).
- **Expected Alerts**: Terminal alert per match plus automated email dispatch.
- **Limitations**: Keyword matching misses polymorphic or obfuscated malware; high false positives in legitimate tools containing flagged words.

### 7. SIM Manipulation Watcher
- **Methodology**: Lists active eSIM bundles and reads `history.log` for changes.
- **Expected Alerts**: Console display of inventory/history; manual analysis required.
- **Limitations**: File paths may differ on future iOS builds; access may be restricted without elevated privileges.

### 8. Report Exporter
- **Methodology**: Creates `~/Analyse_Logs`, aggregates recon + log scan output into `security_report.log`, then calls the email helper.
- **Expected Alerts**: Confirmation message in terminal and email with attachment (requires configured `mail`).
- **Limitations**: Depends on local MTA configuration; log file overwrites previous exports unless archived.

> 🃏 *Casino Trivia Wildcard*: The MIT blackjack team proved disciplined play flips the advantage—mirroring how layered detections shift odds back to defenders.

## Setup & Local Operations
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run development server** (hot reload for UI adjustments)
   ```bash
   npm run dev
   ```
3. **Create production build**
   ```bash
   npm run build
   ```
4. **Serve built assets locally**
   ```bash
   npm run preview
   ```
5. **Execute iOS analyser script** (from macOS/iOS shell with required permissions)
   ```bash
   chmod +x ios_security_analyser.sh
   ./ios_security_analyser.sh
   ```

## Export & Reporting Workflow
- Select menu option **8** in the analyser to generate `security_report.log` and trigger the email alert.
- Reports live under `~/Analyse_Logs/`; archive or ship them to SIEM tooling as needed.
- For audit trails, retain terminal transcripts alongside the exported log to document operator actions.
- QA Tip: run option 1 before option 8 so baseline system info is captured inside the export.

## Offline & PWA Behaviour Notes
- The React bundle can be installed as a pseudo-PWA via browser menus; once cached, the static landing scene loads offline for kiosk demonstrations.
- Detection modules rely on local shell access—offline mode does **not** enable scripted scans without the host OS utilities present.
- Upon regaining connectivity, refreshing the installed app re-syncs assets compiled by Vite (`dist/`).

## Security Considerations
- **Ethical Usage**: Deploy only on devices you own or have explicit authorization to assess; email alerts contain sensitive telemetry—treat them as confidential.
- **Content Security Policy (CSP)**: When hosting the UI, enforce a CSP that whitelists self-origin assets and blocks inline script execution to prevent UI tampering.
- **Integrity Verification**: Verify script checksums before distribution and store the repo on signed media; use version control history to audit modifications.
- **Least Privilege**: Run the analyser with the minimum required permissions, rotating email credentials used for alerting.
- **Data Handling**: Redact exported logs before sharing beyond the security team to avoid leaking device identifiers.

## Gameplay & UX Notes
- The login screen encourages operators to “jack in” with or without a password—ideal for training scenarios that gamify incident response.
- Parallax motion in the landing view reacts to cursor movement, echoing the feel of a casino surveillance pit scanning for anomalies.
- Keep the UI open on a secondary display while running shell modules so QA observers can narrate progress to stakeholders.
- Consider extending the deck with quick links to each detection module’s documentation above for rapid onboarding during tabletop exercises.

