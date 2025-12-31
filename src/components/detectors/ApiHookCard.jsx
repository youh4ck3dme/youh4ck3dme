import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

/**
 * ApiHookCard - Detects fetch/XHR interception
 * Visual theme: Radar sweep
 */
function ApiHookCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="api"
      title="API Hook Detector"
      subtitle="Radar scans for hijacked network calls"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-spyglass"
    >
      <div className="spyglass-console" aria-hidden="true">
        <div className="spyglass-console__radar" />
        <div className="spyglass-console__grid">
          <div className="spyglass-console__chip">{state.status === 'alert' ? '🚨' : '📡'}</div>
          <div className="spyglass-console__chip">{state.status === 'warning' ? '⚠️' : '🔗'}</div>
          <div className="spyglass-console__chip">{state.status === 'pass' ? '✅' : '🔍'}</div>
        </div>
      </div>
    </ModuleCard>
  );
}

ApiHookCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ApiHookCard;

