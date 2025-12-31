import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

function WebRTCSpyglassCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="webrtc"
      title="WebRTC & Network Spyglass"
      subtitle="Surveillance console exposes hidden peers"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-spyglass"
    >
      <div className="spyglass-console" aria-hidden="true">
        <div className="spyglass-console__grid">
          {[...Array(6).keys()].map((chip) => (
            <span key={`chip-${chip}`} className="spyglass-console__chip">
              {chip % 2 === 0 ? '🛰️' : '🎲'}
            </span>
          ))}
        </div>
        <div className="spyglass-console__radar" />
      </div>
    </ModuleCard>
  );
}

WebRTCSpyglassCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default WebRTCSpyglassCard;
