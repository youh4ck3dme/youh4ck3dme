const statusMessages = {
  idle: 'Ready when you are. Start a sweep to collect fresh telemetry.',
  scanning: 'Running probes across all modules…',
  completed: 'Latest sweep completed successfully.',
  halted: 'Scan halted. Investigate partial results before retrying.'
};

export default function ControlPanel({
  scanState,
  isScanning,
  onStart,
  onStop,
  onReset,
  lastRunAt
}) {
  const statusMessage = statusMessages[scanState] ?? statusMessages.idle;
  const timeLabel = lastRunAt ? new Date(lastRunAt).toLocaleTimeString() : null;

  return (
    <section className="control-panel">
      <div>
        <p className="section-title">Scan control</p>
        <h1 className="control-panel__title">iOS security sweep</h1>
        <p className="control-panel__status">{statusMessage}</p>
        {timeLabel && (
          <p className="control-panel__meta">Last completed run: {timeLabel}</p>
        )}
      </div>
      <div className="control-panel__actions">
        <button type="button" onClick={onStart} className="app-button primary" disabled={isScanning}>
          {isScanning ? 'Scanning…' : 'Start sweep'}
        </button>
        <button type="button" onClick={onStop} className="app-button secondary" disabled={!isScanning}>
          Halt scan
        </button>
        <button type="button" onClick={onReset} className="app-button ghost">
          Reset
        </button>
      </div>
    </section>
  );
}
