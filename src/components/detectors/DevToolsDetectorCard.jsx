import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

function DevToolsDetectorCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="devtools"
      title="DevTools Intrusion Detector"
      subtitle="Poker hand flips when debugging eyes peek in"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-poker"
    >
      <div className="poker-hand" aria-hidden="true">
        {["A♠", "K♦", "Q♥", "J♣", state.status === 'alert' ? '🕵️' : '10♠'].map((card, index) => (
          <span key={`card-${card}-${index}`} className="poker-hand__card">{card}</span>
        ))}
      </div>
    </ModuleCard>
  );
}

DevToolsDetectorCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default DevToolsDetectorCard;
