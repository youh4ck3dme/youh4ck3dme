export default function ExportClearControls({ onExport, onClear, disabled }) {
  return (
    <div className="telemetry-actions">
      <button type="button" onClick={onExport} className="app-button secondary" disabled={disabled}>
        Export logs
      </button>
      <button type="button" onClick={onClear} className="app-button ghost" disabled={disabled}>
        Clear logs
      </button>
    </div>
  );
}
