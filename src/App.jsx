import { useCallback, useMemo, useState } from 'react';
import LoginPage from './LoginPage';
import ControlPanel from './components/controls/ControlPanel';
import ExportClearControls from './components/controls/ExportClearControls';
import CasinoTriviaPopup from './components/helpers/CasinoTriviaPopup';
import LogStream from './components/helpers/LogStream';
import WebViewHunterCard from './components/modules/WebViewHunterCard';
import MitmRadarCard from './components/modules/MitmRadarCard';
import RuntimeMonitorCard from './components/modules/RuntimeMonitorCard';
import DevToolsDetectorCard from './components/modules/DevToolsDetectorCard';
import IntegrityVerifierCard from './components/modules/IntegrityVerifierCard';
import WebRTCSpyglassCard from './components/modules/WebRTCSpyglassCard';
import useDetectors from './hooks/useDetectors';

const moduleCatalog = [
  { id: 'webview', title: 'WebView Hunter', component: WebViewHunterCard },
  { id: 'mitm', title: 'MITM Radar', component: MitmRadarCard },
  { id: 'runtime', title: 'Runtime Monitor', component: RuntimeMonitorCard },
  { id: 'devtools', title: 'DevTools Detector', component: DevToolsDetectorCard },
  { id: 'integrity', title: 'Integrity Verifier', component: IntegrityVerifierCard },
  { id: 'webrtc', title: 'WebRTC Spyglass', component: WebRTCSpyglassCard }
];

const anchors = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

function ScannerConsole({ operator }) {
  const [activeModule, setActiveModule] = useState('webview');
  const [triviaAnchor, setTriviaAnchor] = useState('top-right');
  const [showTrivia, setShowTrivia] = useState(false);

  const {
    results,
    logs,
    isScanning,
    scanState,
    lastRunAt,
    startScan,
    stopScan,
    resetResults,
    clearLogs,
    exportLogs
  } = useDetectors();

  const summaryChips = useMemo(() => {
    const total = moduleCatalog.length;
    const completed = Object.values(results).filter((entry) => entry?.status && entry.status !== 'pending' && entry.status !== 'scanning').length;
    const progress = Math.round((completed / total) * 100);
    return { total, completed, progress };
  }, [results]);

  const ActiveModule = useMemo(
    () => moduleCatalog.find((module) => module.id === activeModule)?.component ?? moduleCatalog[0].component,
    [activeModule]
  );

  const handleStart = useCallback(() => {
    startScan();
  }, [startScan]);

  const handleStop = useCallback(() => {
    stopScan();
  }, [stopScan]);

  const handleReset = useCallback(() => {
    resetResults();
    clearLogs();
    setActiveModule('webview');
  }, [resetResults, clearLogs]);

  const handleExport = useCallback(() => {
    const payload = exportLogs();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchorTag = document.createElement('a');
    anchorTag.href = url;
    anchorTag.download = `casino-telemetry-${Date.now()}.json`;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
    URL.revokeObjectURL(url);
  }, [exportLogs]);

  const handleTrivia = useCallback(() => {
    const randomAnchor = anchors[Math.floor(Math.random() * anchors.length)];
    setTriviaAnchor(randomAnchor);
    setShowTrivia(true);
  }, []);

  return (
    <div className="scanner-shell">
      <aside className="scanner-rail">
        <div className="operator-card">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Operator</p>
          <h2 className="text-2xl font-black text-white">{operator}</h2>
          <p className="text-xs text-slate-400 mt-2">{summaryChips.completed} / {summaryChips.total} modules locked</p>
          <div className="progress-bar" role="progressbar" aria-valuenow={summaryChips.progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar-fill" style={{ width: `${summaryChips.progress}%` }} />
          </div>
        </div>
        <nav className="module-nav">
          {moduleCatalog.map((module) => {
            const status = results[module.id]?.status ?? 'pending';
            return (
              <button
                key={module.id}
                type="button"
                className={`module-nav-item ${activeModule === module.id ? 'active' : ''} status-${status}`}
                onClick={() => setActiveModule(module.id)}
              >
                <span>{module.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="scanner-stage">
        <ControlPanel
          scanState={scanState}
          isScanning={isScanning}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
          lastRunAt={lastRunAt}
        />
        <section className="module-stage">
          <ActiveModule result={results[activeModule]} onTriggerTrivia={handleTrivia} />
        </section>
        <section className="telemetry-row">
          <h3 className="section-title">Telemetry</h3>
          <ExportClearControls onExport={handleExport} onClear={clearLogs} disabled={!logs.length} />
        </section>
        <LogStream entries={logs} />
      </main>
      {showTrivia && (
        <CasinoTriviaPopup
          anchor={triviaAnchor}
          onClose={() => setShowTrivia(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [operator, setOperator] = useState(null);

  if (!operator) {
    return <LoginPage onLogin={setOperator} />;
  }

  return <ScannerConsole operator={operator} />;
}
