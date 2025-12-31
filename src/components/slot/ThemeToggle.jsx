import PropTypes from 'prop-types';
import { useState, useCallback, createContext, useContext } from 'react';

/**
 * Slot Machine Theme Context
 */
const SlotThemeContext = createContext({
  isSlotTheme: false,
  toggleTheme: () => {},
});

/**
 * Hook to access slot theme state
 */
export function useSlotTheme() {
  const context = useContext(SlotThemeContext);
  if (!context) {
    throw new Error('useSlotTheme must be used within a SlotThemeProvider');
  }
  return context;
}

/**
 * SlotThemeProvider - Context provider for slot machine theme state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.initialState - Initial theme state (true = slot theme)
 */
function SlotThemeProvider({ children, initialState = false }) {
  const [isSlotTheme, setIsSlotTheme] = useState(initialState);

  const toggleTheme = useCallback(() => {
    setIsSlotTheme(prev => !prev);
  }, []);

  return (
    <SlotThemeContext.Provider value={{ isSlotTheme, toggleTheme }}>
      {children}
    </SlotThemeContext.Provider>
  );
}

SlotThemeProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.bool,
};

/**
 * ThemeToggle - Toggle button to switch between default and slot machine themes
 * 
 * @param {Object} props
 * @param {string} props.variant - Button style variant: 'button' | 'icon' | 'compact'
 * @param {string} props.activeLabel - Label when slot theme is active
 * @param {string} props.inactiveLabel - Label when slot theme is inactive
 */
function ThemeToggle({ 
  variant = 'button',
  activeLabel = '🎰 Slot Mode',
  inactiveLabel = '⚡ Default Mode'
}) {
  const { isSlotTheme, toggleTheme } = useSlotTheme();
  const [label, setLabel] = useState(activeLabel);

  const handleToggle = useCallback(() => {
    toggleTheme();
    setLabel(isSlotTheme ? inactiveLabel : activeLabel);
  }, [isSlotTheme, toggleTheme, activeLabel, inactiveLabel]);

  if (variant === 'icon') {
    return (
      <button
        className={`slot-theme-toggle ${isSlotTheme ? 'slot-theme-toggle--active' : ''}`}
        onClick={handleToggle}
        aria-pressed={isSlotTheme}
        aria-label={isSlotTheme ? 'Switch to default theme' : 'Switch to slot machine theme'}
        title={isSlotTheme ? 'Switch to default theme' : 'Switch to slot machine theme'}
      >
        <span className="slot-theme-toggle__icon">{isSlotTheme ? '🎰' : '🎛️'}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        className={`slot-theme-toggle ${isSlotTheme ? 'slot-theme-toggle--active' : ''}`}
        onClick={handleToggle}
        aria-pressed={isSlotTheme}
        aria-label={isSlotTheme ? 'Switch to default theme' : 'Switch to slot machine theme'}
        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
      >
        <span className="slot-theme-toggle__icon">{isSlotTheme ? '🎰' : '🎛️'}</span>
        {isSlotTheme ? 'Default' : 'Slot'}
      </button>
    );
  }

  return (
    <button
      className={`slot-theme-toggle ${isSlotTheme ? 'slot-theme-toggle--active' : ''}`}
      onClick={handleToggle}
      aria-pressed={isSlotTheme}
      aria-label={isSlotTheme ? 'Switch to default theme' : 'Switch to slot machine theme'}
    >
      <span className="slot-theme-toggle__icon">{isSlotTheme ? '🎰' : '🎛️'}</span>
      <span>{isSlotTheme ? activeLabel : inactiveLabel}</span>
    </button>
  );
}

ThemeToggle.propTypes = {
  variant: PropTypes.oneOf(['button', 'icon', 'compact']),
  activeLabel: PropTypes.string,
  inactiveLabel: PropTypes.string,
};

// Export context and provider for advanced usage
export { SlotThemeContext, SlotThemeProvider };

export default ThemeToggle;

