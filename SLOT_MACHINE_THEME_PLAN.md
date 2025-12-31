# Slot Machine Theme Implementation Plan

## Information Gathered
- **Project**: React PWA for casino manipulation detection
- **Tech Stack**: React 19, Vite, CSS (no Tailwind in use currently)
- **Component Pattern**: Uses `ModuleCard` wrapper with `accent` prop for theming
- **Styling**: CSS variables defined in `styles.css`
- **Props**: Uses prop-types for type validation

## Plan

### 1. Create CSS Variables for Slot Machine Theme
Add to `src/styles.css`:
- `--slot-primary`: Deep casino felt green (#0D5C2E)
- `--slot-secondary`: Darker green (#1A3A1E)
- `--slot-gold`: Gold/brass (#D4AF37)
- `--slot-gold-light`: Bright gold (#FFD700)
- `--slot-ruby`: Ruby red (#E63946)
- `--slot-amber`: LED amber (#FFA500)
- `--slot-velvet`: Velvet purple (#2D1B4E)
- `--slot-wood`: Mahogany (#3D2817)
- `--slot-chrome`: Chrome silver (#C0C0C0)
- `--slot-led`: LED display orange (#FF6B00)

### 2. Create Components

#### 2.1 `src/components/slot/SlotReel.jsx`
- Individual spinning reel component
- Props: `symbols`, `isSpinning`, `currentSymbol`, `speed`
- Animated symbols array with smooth transitions
- 60fps CSS animations

#### 2.2 `src/components/slot/SlotLever.jsx`
- Interactive lever/arm mechanism
- Props: `onPull`, `isPulled`, `disabled`
- Pull animation when clicked
- Visual lever arm with chrome/gold styling

#### 2.3 `src/components/slot/SlotMachineTheme.jsx`
- Theme wrapper component
- Provides slot machine aesthetic container
- Props: `children`, `variant` (compact/full)
- Gold borders, chrome accents, LED displays

#### 2.4 `src/components/slot/ThemeToggle.jsx`
- Theme switcher component
- Toggle between default and slot machine themes
- Smooth transitions between themes

### 3. Update ModuleCard for Slot Integration
Add slot-specific CSS classes for integration with existing components

### 4. Create Demo Usage
Update App.jsx or create a demo showing the slot machine theme in action

## Dependent Files to be Edited
- `src/styles.css` - Add slot machine CSS variables and classes
- `src/components/ModuleCard.jsx` - May need minor updates for slot accent support

## New Files to be Created
- `src/components/slot/SlotReel.jsx`
- `src/components/slot/SlotLever.jsx`
- `src/components/slot/SlotMachineTheme.jsx`
- `src/components/slot/ThemeToggle.jsx`
- `src/components/slot/index.js` - Barrel export

## Followup Steps
1. Verify components render correctly in dev mode
2. Test animations on different screen sizes
3. Ensure accessibility (ARIA labels, keyboard navigation)
4. Test theme toggle functionality

