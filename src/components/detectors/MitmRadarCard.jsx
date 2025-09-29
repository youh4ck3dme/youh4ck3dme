import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

function MitmRadarCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="mitm"
      title="MITM & TLS Exploit Radar"
      subtitle="Roulette wheel spins through certificate probes"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-roulette"
    >
      <div className="roulette" aria-hidden="true">
        <div className="roulette__wheel">
          {[...Array(12).keys()].map((slot) => (
            <span className="roulette__slot" key={`slot-${slot}`}>💠</span>
          ))}
        </div>
        <div className={`roulette__pointer ${state.status === 'alert' ? 'roulette__pointer--alert' : ''}`}>
          <span>🔻</span>
        </div>
      </div>
    </ModuleCard>
  );
}

MitmRadarCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default MitmRadarCard;
