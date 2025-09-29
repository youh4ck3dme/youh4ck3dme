export default function ExportClearControls({ onExport, onClear, disabled }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onExport} className="casino-button" disabled={disabled}>
        Export logs
      </button>
      <button
        type="button"
        onClick={onClear}
        className="casino-button secondary"
        disabled={disabled}
      >
        Clear logs
      </button>
    </div>
  );
}
