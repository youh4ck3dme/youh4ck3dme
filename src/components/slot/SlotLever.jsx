import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

/**
 * SlotLever - Interactive lever/arm mechanism for slot machine theme
 * 
 * @param {Object} props
 * @param {Function} props.onPull - Callback when lever is pulled
 * @param {boolean} props.disabled - Whether the lever is disabled
 * @param {boolean} props.isPulled - Whether the lever is currently pulled
 */
function SlotLever({ onPull, disabled = false, isPulled = false }) {
  const [pulled, setPulled] = useState(isPulled);
  const [animating, setAnimating] = useState(false);

  const handlePull = useCallback(() => {
    if (disabled || animating) return;

    setAnimating(true);
    setPulled(true);

    // Trigger pull callback
    if (onPull) {
      onPull();
    }

    // Animate lever back after delay
    setTimeout(() => {
      setPulled(false);
      setAnimating(false);
    }, 600);
  }, [disabled, animating, onPull]);

  return (
    <div 
      className={`slot-lever ${pulled ? 'slot-lever--pulled' : ''}`}
      role="button"
      aria-label="Pull lever to spin"
      tabIndex={disabled ? -1 : 0}
      onClick={handlePull}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePull();
        }
      }}
    >
      <div className="slot-lever__base" />
      <div className="slot-lever__arm">
        <div className="slot-lever__handle">
          <div className="slot-lever__button" />
        </div>
      </div>
    </div>
  );
}

SlotLever.propTypes = {
  onPull: PropTypes.func,
  disabled: PropTypes.bool,
  isPulled: PropTypes.bool,
};

export default SlotLever;

