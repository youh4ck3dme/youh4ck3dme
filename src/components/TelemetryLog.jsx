import PropTypes from 'prop-types';

function TelemetryLog({ entries }) {
  if (entries.length === 0) {
    return (
      <div className="telemetry telemetry--empty" aria-live="polite">
        <p>No telemetry yet. Spin up a scan to populate the pit boss console.</p>
      </div>
    );
  }

  return (
    <div className="telemetry" aria-live="polite">
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} className={`telemetry__item telemetry__item--${entry.level}`}>
            <span className="telemetry__time">{entry.timestamp}</span>
            <span className="telemetry__module">[{entry.module}]</span>
            <span className="telemetry__message">{entry.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

TelemetryLog.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      module: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['info', 'success', 'warning', 'alert']).isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TelemetryLog;
