import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '🔔', '🎰', '💣'];

/**
 * SlotReel - Individual spinning reel component for slot machine theme
 * 
 * @param {Object} props
 * @param {boolean} props.isSpinning - Whether the reel is currently spinning
 * @param {string} props.currentSymbol - The current symbol to display
 * @param {string} props.status - Security status: 'idle', 'running', 'pass', 'warning', 'alert'
 * @param {Function} props.onSymbolChange - Callback when symbol changes during spin
 */
function SlotReel({ isSpinning = false, currentSymbol = '🎰', status = 'idle', onSymbolChange }) {
  const [displaySymbol, setDisplaySymbol] = useState(currentSymbol);
  const [animationSpeed, setAnimationSpeed] = useState(100);

  // Spin animation effect
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        const randomSymbol = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
        setDisplaySymbol(randomSymbol);
        if (onSymbolChange) {
          onSymbolChange(randomSymbol);
        }
      }, animationSpeed);
      
      return () => clearInterval(interval);
    } else {
      setDisplaySymbol(currentSymbol);
    }
  }, [isSpinning, currentSymbol, animationSpeed, onSymbolChange]);

  // Slow down animation as spinning stops
  useEffect(() => {
    if (isSpinning) {
      const timer = setTimeout(() => {
        setAnimationSpeed(150);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAnimationSpeed(100);
    }
  }, [isSpinning]);

  const getStatusClass = () => {
    switch (status) {
      case 'running':
        return 'slot-symbol--scanning';
      case 'pass':
        return 'slot-symbol--pass';
      case 'warning':
        return 'slot-symbol--warning';
      case 'alert':
        return 'slot-symbol--alert';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`slot-reel ${isSpinning ? 'slot-reel--spinning' : ''}`}
      role="img"
      aria-label={`Slot reel showing ${displaySymbol}`}
    >
      <span className={`slot-reel__symbol ${getStatusClass()}`}>
        {displaySymbol}
      </span>
    </div>
  );
}

SlotReel.propTypes = {
  isSpinning: PropTypes.bool,
  currentSymbol: PropTypes.string,
  status: PropTypes.oneOf(['idle', 'running', 'pass', 'warning', 'alert']),
  onSymbolChange: PropTypes.func,
};

export default SlotReel;

