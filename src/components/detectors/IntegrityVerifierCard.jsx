import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

function IntegrityVerifierCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="integrity"
      title="Resource & Integrity Verifier"
      subtitle="Bouncer alerts guard hashed asset lineup"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-bouncer"
    >
      <div className="integrity-bouncer" aria-hidden="true">
        <div className="integrity-bouncer__door">🚪</div>
        <div className="integrity-bouncer__guard">{state.status === 'alert' ? '🛑' : '🕶️'}</div>
        <div className="integrity-bouncer__lights">
          <span className="integrity-bouncer__light integrity-bouncer__light--left" />
          <span className="integrity-bouncer__light integrity-bouncer__light--right" />
        </div>
      </div>
    </ModuleCard>
  );
}

IntegrityVerifierCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default IntegrityVerifierCard;
