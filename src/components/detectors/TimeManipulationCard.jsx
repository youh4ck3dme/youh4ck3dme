import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

/**
 * TimeManipulationCard - Detects system time tampering
 * Visual theme: Roulette wheel with time numbers
 */
function TimeManipulationCard({ state, onRun, disabled }) {
  const timeNumbers = ['00', '12', '3', '6', '9'];
  
  return (
    <ModuleCard
      id="time"
      title="Time Manipulation Detector"
      subtitle="Roulette wheel checks for clock tampering"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-roulette"
    >
      <div className="roulette" aria-hidden="true">
        <div className="roulette__wheel">
          {timeNumbers.map((num, i) => (
            <span key={i} className="roulette__slot">
              {state.status === 'alert' && i === 2 ? '⏰🚨' : num}
            </span>
          ))}
        </div>
        <span className={`roulette__pointer ${state.status === 'alert' ? 'roulette__pointer--alert' : ''}`}>
          ▼
        </span>
      </div>
    </ModuleCard>
  );
}

TimeManipulationCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default TimeManipulationCard;

