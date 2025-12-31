import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

function RuntimeMonitorCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="runtime"
      title="JavaScript Hook & Runtime Monitor"
      subtitle="Neon diagnostics catch proxy traps in motion"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-neon"
    >
      <div className="neon-grid" aria-hidden="true">
        {[...Array(9).keys()].map((cell) => (
          <span
            key={`neon-${cell}`}
            className={`neon-grid__cell neon-grid__cell--${state.status}`}
          />
        ))}
      </div>
    </ModuleCard>
  );
}

RuntimeMonitorCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default RuntimeMonitorCard;
