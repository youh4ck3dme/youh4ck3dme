import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import SlotReel from './SlotReel';
import SlotLever from './SlotLever';

/**
 * Symbol mapping for security scan results
 */
const SYMBOL_MAP = {
  scanning: '🎰',
  pass: '💎',
  warning: '🔔',
  alert: '💣',
  minor: '🍒',
  info: '🍋',
};

/**
 * SlotMachineTheme - Complete slot machine themed wrapper component
 * Provides immersive casino slot machine visuals for security scanning
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child content to wrap
 * @param {string} props.variant - Theme variant: 'compact' | 'full'
 * @param {Array} props.results - Array of scan results { status, message }
 * @param {Function} props.onSpin - Callback when lever is pulled
 * @param {boolean} props.isScanning - Whether scanning is in progress
 * @param {string} props.ledMessage - Message to display on LED
 */
function SlotMachineTheme({ 
  children,
  variant = 'full',
  results = [],
  onSpin,
  isScanning = false,
  ledMessage = 'STAND BY'
}) {
  const [isPulled, setIsPulled] = useState(false);
  const [displaySymbols, setDisplaySymbols] = useState(['🎰', '🎰', '🎰']);

  const handleLeverPull = useCallback(() => {
    setIsPulled(true);
    
    // Reset symbols to spinning state
    setDisplaySymbols(['🎰', '🎰', '🎰']);
    
    // Trigger spin callback
    if (onSpin) {
      onSpin();
    }

    // Reset lever after animation
    setTimeout(() => {
      setIsPulled(false);
    }, 600);
  }, [onSpin]);

  const handleSymbolChange = useCallback((index, symbol) => {
    setDisplaySymbols(prev => {
      const next = [...prev];
      next[index] = symbol;
      return next;
    });
  }, []);

  const getStatusSymbol = (status) => {
    return SYMBOL_MAP[status] || SYMBOL_MAP.scanning;
  };

  // Map results to symbols for display
  const reels = results.length > 0 
    ? results.map(r => getStatusSymbol(r.status))
    : displaySymbols;

  return (
    <div className="slot-machine-container" role="region" aria-label="Slot Machine Security Scanner">
      {/* Decorative lights */}
      <div className="slot-decorative-lights" aria-hidden="true">
        {[-20, 0, 20, 40, 60, 80, 100, 120, 140, 160].map((pos) => (
          <span
            key={pos}
            className={`slot-light ${
              pos % 60 === 0 ? 'slot-light--red' : 
              pos % 40 === 0 ? 'slot-light--amber' : 
              'slot-light--green'
            }`}
            style={{ left: `${pos}%`, top: pos % 40 === 0 ? '5px' : 'auto', bottom: pos % 40 === 0 ? '5px' : 'auto' }}
          />
        ))}
      </div>

      {/* Header with LED display */}
      <div className="slot-machine-header">
        <h2 className="slot-machine-title">🎰 SECURITY SCAN 🎰</h2>
        <div className={`slot-led-display ${isScanning ? 'slot-led-display--blink' : ''}`}>
          {isScanning ? 'SCANNING...' : ledMessage}
        </div>
      </div>

      {/* Reels section */}
      <div style={{ position: 'relative', paddingRight: variant === 'full' ? '50px' : '0' }}>
        <div className="slot-reels-container">
          {/* Win line indicator */}
          <div className="slot-win-line slot-win-line--middle" aria-hidden="true" />
          
          {variant === 'full' ? (
            // Full slot machine with 3 reels
            [0, 1, 2].map((index) => (
              <SlotReel
                key={index}
                isSpinning={isScanning}
                currentSymbol={reels[index] || '🎰'}
                status={results[index]?.status || 'idle'}
                onSymbolChange={(symbol) => handleSymbolChange(index, symbol)}
              />
            ))
          ) : (
            // Compact view - single combined display
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              {results.map((result, index) => (
                <SlotReel
                  key={index}
                  isSpinning={isScanning}
                  currentSymbol={getStatusSymbol(result.status)}
                  status={result.status}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lever (only in full variant) */}
        {variant === 'full' && (
          <SlotLever 
            onPull={handleLeverPull}
            disabled={isScanning}
            isPulled={isPulled}
          />
        )}
      </div>

      {/* Paytable showing symbol meanings */}
      <div className="slot-paytable">
        <h3 className="slot-paytable__title">📋 SECURITY PAYTABLE</h3>
        <div className="slot-paytable__items">
          <div className="slot-paytable__item">
            <span className="slot-paytable__symbol">💎</span>
            <span>Pass - Clean</span>
            <span className="slot-paytable__value">100</span>
          </div>
          <div className="slot-paytable__item">
            <span className="slot-paytable__symbol">🔔</span>
            <span>Warning</span>
            <span className="slot-paytable__value">50</span>
          </div>
          <div className="slot-paytable__item">
            <span className="slot-paytable__symbol">💣</span>
            <span>Alert - Threat</span>
            <span className="slot-paytable__value">0</span>
          </div>
          <div className="slot-paytable__item">
            <span className="slot-paytable__symbol">🍒</span>
            <span>Minor Issue</span>
            <span className="slot-paytable__value">25</span>
          </div>
        </div>
      </div>

      {/* Child content */}
      {children && (
        <div style={{ marginTop: '1.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}

SlotMachineTheme.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['compact', 'full']),
  results: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.oneOf(['idle', 'running', 'pass', 'warning', 'alert']).isRequired,
      message: PropTypes.string,
    })
  ),
  onSpin: PropTypes.func,
  isScanning: PropTypes.bool,
  ledMessage: PropTypes.string,
};

// Symbol constants for external use
SlotMachineTheme.SYMBOLS = SYMBOL_MAP;

export default SlotMachineTheme;

