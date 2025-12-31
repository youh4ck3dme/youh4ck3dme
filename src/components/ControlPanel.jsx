import PropTypes from 'prop-types';

function ControlPanel({ onRunFullScan, onClearLogs, onExportJson, onExportCsv, disabled, hasLogs, extraControls }) {
  return (
    <div className="control-panel">
      <button className="button button--primary" type="button" onClick={onRunFullScan} disabled={disabled}>
        Run Full Scan
      </button>
      <div className="control-panel__secondary">
        {extraControls}
        <button className="button" type="button" onClick={onExportJson} disabled={disabled || !hasLogs}>
          Export Report (JSON)
        </button>
        <button className="button" type="button" onClick={onExportCsv} disabled={disabled || !hasLogs}>
          Export Report (CSV)
        </button>
        <button className="button button--ghost" type="button" onClick={onClearLogs} disabled={disabled || !hasLogs}>
          Clear Logs
        </button>
      </div>
    </div>
  );
}

ControlPanel.propTypes = {
  onRunFullScan: PropTypes.func.isRequired,
  onClearLogs: PropTypes.func.isRequired,
  onExportJson: PropTypes.func.isRequired,
  onExportCsv: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  hasLogs: PropTypes.bool.isRequired,
  extraControls: PropTypes.node,
};

export default ControlPanel;
