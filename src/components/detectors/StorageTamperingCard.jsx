import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

/**
 * StorageTamperingCard - Detects manipulation of localStorage/sessionStorage
 * Visual theme: Safe deposit box
 */
function StorageTamperingCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="storage"
      title="Storage Tampering Detector"
      subtitle="Vault checks for modified casino data stores"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-bouncer"
    >
      <div className="integrity-bouncer" aria-hidden="true">
        <div className="integrity-bouncer__door">
          {state.status === 'alert' ? '🚪🔓' : '🚪🔒'}
        </div>
        <div className="integrity-bouncer__guard">
          {state.status === 'pass' ? '🛡️' : state.status === 'warning' ? '⚠️' : '🔍'}
        </div>
        <div className="integrity-bouncer__lights">
          <div className={`integrity-bouncer__light ${state.status === 'alert' ? 'integrity-bouncer__light--right' : ''}`} />
          <div className={`integrity-bouncer__light ${state.status === 'pass' ? '' : 'integrity-bouncer__light--right'}`} />
        </div>
      </div>
    </ModuleCard>
  );
}

StorageTamperingCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default StorageTamperingCard;

