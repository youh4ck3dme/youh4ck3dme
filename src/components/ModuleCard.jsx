import PropTypes from 'prop-types';

const statusColors = {
  idle: 'badge-idle',
  running: 'badge-running',
  pass: 'badge-pass',
  warning: 'badge-warning',
  alert: 'badge-alert',
  error: 'badge-alert',
};

function ModuleCard({ id, title, subtitle, status, summary, details, onRun, disabled, accent, children }) {
  return (
    <section className={`module-card ${accent}`} aria-labelledby={`${id}-title`}>
      <header className="module-card__header">
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          {subtitle && <p className="module-card__subtitle">{subtitle}</p>}
        </div>
        <div className={`module-card__status ${statusColors[status] ?? statusColors.idle}`}>
          <span className="module-card__status-dot" />
          <span className="module-card__status-label">{statusLabel(status)}</span>
        </div>
      </header>

      <div className="module-card__visual" role="presentation">
        {children}
      </div>

      <div className="module-card__body">
        <p className="module-card__summary">{summary}</p>
        {details && details.length > 0 && (
          <ul className="module-card__details">
            {details.map((item, index) => (
              <li key={`${id}-detail-${index}`}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <footer className="module-card__footer">
        <button
          className="button button--secondary"
          type="button"
          onClick={onRun}
          disabled={disabled}
          aria-label={`Run ${title}`}
        >
          Re-scan Module
        </button>
      </footer>
    </section>
  );
}

function statusLabel(status) {
  switch (status) {
    case 'running':
      return 'Scanning';
    case 'pass':
      return 'Stable';
    case 'warning':
      return 'Suspicious';
    case 'alert':
      return 'Compromised';
    case 'error':
      return 'Error';
    default:
      return 'Idle';
  }
}

ModuleCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  status: PropTypes.oneOf(['idle', 'running', 'pass', 'warning', 'alert', 'error']).isRequired,
  summary: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string),
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  accent: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ModuleCard.defaultProps = {
  subtitle: '',
  details: [],
  disabled: false,
  accent: 'accent-default',
};

export default ModuleCard;
