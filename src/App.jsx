import ControlPanel from './components/ControlPanel';
import CasinoTriviaPopup from './components/CasinoTriviaPopup';
import TelemetryLog from './components/TelemetryLog';
import WebViewHunterCard from './components/detectors/WebViewHunterCard';
import MitmRadarCard from './components/detectors/MitmRadarCard';
import RuntimeMonitorCard from './components/detectors/RuntimeMonitorCard';
import DevToolsDetectorCard from './components/detectors/DevToolsDetectorCard';
import IntegrityVerifierCard from './components/detectors/IntegrityVerifierCard';
import WebRTCSpyglassCard from './components/detectors/WebRTCSpyglassCard';
import useDetectors from './hooks/useDetectors';

const MODULE_COMPONENTS = [
  { id: 'webview', Component: WebViewHunterCard },
  { id: 'mitm', Component: MitmRadarCard },
  { id: 'runtime', Component: RuntimeMonitorCard },
  { id: 'devtools', Component: DevToolsDetectorCard },
  { id: 'integrity', Component: IntegrityVerifierCard },
  { id: 'webrtc', Component: WebRTCSpyglassCard },
];

function App() {
  const { modules, logs, isScanning, activeTrivia, runFullScan, runModule, clearLogs, exportLogs, dismissTrivia } =
    useDetectors();
  const hasLogs = logs.length > 0;

  return (
    <div className="app-shell">
      <CasinoTriviaPopup trivia={activeTrivia} onDismiss={dismissTrivia} />
      <header className="app-shell__header">
        <div className="app-shell__brand">
          <span className="app-shell__emoji">🧮</span>
          <div>
            <h1>RiggedGuard Rampage React</h1>
            <p className="app-shell__subtitle">
              Aggressive casino forensic PWA scanning WebViews, MITM lanes, runtime hooks, DevTools prying, asset hashes, and
              WebRTC spycraft.
            </p>
          </div>
        </div>
        <div className="app-shell__badge" aria-live="polite">
          {isScanning ? 'Scanning in progress…' : 'Standing by for the next table sweep.'}
        </div>
      </header>

      <ControlPanel
        onRunFullScan={runFullScan}
        onClearLogs={clearLogs}
        onExportJson={() => exportLogs('json')}
        onExportCsv={() => exportLogs('csv')}
        disabled={isScanning}
        hasLogs={hasLogs}
      />

      <main className="module-grid" aria-live="polite" aria-busy={isScanning}>
        {MODULE_COMPONENTS.map(({ id, Component }) => (
          <Component key={id} state={modules[id]} onRun={() => runModule(id)} disabled={isScanning} />
        ))}
      </main>

      <section className="telemetry-section">
        <h2>Telemetry Stream</h2>
        <TelemetryLog entries={logs} />
      </section>

      <footer className="app-shell__footer">
        <p>
          Passive forensic tooling only. Use responsibly, keep casino games fair, and log every anomaly before you cash out.
        </p>
      </footer>
    </div>
  );
}

export default App;
