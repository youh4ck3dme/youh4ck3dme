const statusLabels = {
  pending: 'Awaiting run',
  scanning: 'Running checks',
  pass: 'Passed',
  warn: 'Investigate',
  fail: 'Action required'
};

const statusClassNames = {
  pending: 'module-card--pending',
  scanning: 'module-card--scanning',
  pass: 'module-card--pass',
  warn: 'module-card--warn',
  fail: 'module-card--fail'
};

export default function ModuleCard({
  title,
  subtitle,
  icon,
  result,
  onTriggerTrivia,
  children
}) {
  const status = result?.status ?? 'pending';
  const details = result?.details ?? 'Stand by for the next scan.';
  const statusLabel = statusLabels[status] ?? statusLabels.pending;
  const statusClass = statusClassNames[status] ?? statusClassNames.pending;

  return (
    <article className={`module-card ${statusClass}`}>
      <header className="module-card__header">
        <div className="module-card__icon" aria-hidden="true">
          {icon}
        </div>
        <div>
          <h2 className="module-card__title">{title}</h2>
          <p className="module-card__subtitle">{subtitle}</p>
        </div>
        <div className="module-card__status">
          <label>Status</label>
          <span>
            <span className="module-card__status-dot" aria-hidden="true" />
            {statusLabel}
          </span>
        </div>
      </header>
      <p className="module-card__body">{details}</p>
      <div className="module-card__visual" aria-live="polite">
        {children}
      </div>
      <footer className="module-card__footer">
        <span>Results refresh when the next sweep completes.</span>
        <button type="button" onClick={onTriggerTrivia} className="app-button ghost">
          Show insight
        </button>
      </footer>
    </article>
  );
}
