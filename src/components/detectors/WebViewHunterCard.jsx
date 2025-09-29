import PropTypes from 'prop-types';
import ModuleCard from '../ModuleCard';

function WebViewHunterCard({ state, onRun, disabled }) {
  return (
    <ModuleCard
      id="webview"
      title="WebView & WebKit Intrusion Hunter"
      subtitle="Slot reels track injected bridges and native tampering"
      status={state.status}
      summary={state.summary}
      details={state.details}
      onRun={onRun}
      disabled={disabled}
      accent="accent-slot"
    >
      <div className="slot-machine" aria-hidden="true">
        {[0, 1, 2].map((reel) => (
          <div className="slot-machine__reel" key={`reel-${reel}`}>
            <span className="slot-machine__icon">🎰</span>
            <span className="slot-machine__icon">{state.status === 'alert' ? '🚨' : '🍀'}</span>
            <span className="slot-machine__icon">{state.status === 'warning' ? '⚠️' : '💎'}</span>
            <span className="slot-machine__icon">{state.status === 'running' ? '🔍' : '⭐️'}</span>
          </div>
        ))}
        <div className="slot-machine__scanline" />
      </div>
    </ModuleCard>
  );
}

WebViewHunterCard.propTypes = {
  state: PropTypes.shape({
    status: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default WebViewHunterCard;
