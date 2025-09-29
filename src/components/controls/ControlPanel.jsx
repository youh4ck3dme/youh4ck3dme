const statusMessages = {
  idle: 'Ready for another high-stakes run.',
  scanning: 'Sweeping the floor for shady hands...',
  completed: 'Latest sweep sealed. Spin again when ready.',
  halted: 'Scan halted before the last shoe was dealt.'
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
    <div className="control-panel">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Scan control</p>
        <h1 className="text-3xl font-black text-white drop-shadow-lg">Casino Security Sweep</h1>
        <p className="text-sm text-slate-200/80 mt-1">{statusMessage}</p>
        {timeLabel && (
          <p className="text-xs text-slate-400 mt-1">Last sweep finished at {timeLabel}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="casino-button"
          disabled={isScanning}
        >
          {isScanning ? 'Spinning...' : 'Start sweep'}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="casino-button secondary"
          disabled={!isScanning}
        >
          Halt
        </button>
        <button type="button" onClick={onReset} className="casino-button ghost">
          Reset
        </button>
      </div>
    </div>
  );
}
