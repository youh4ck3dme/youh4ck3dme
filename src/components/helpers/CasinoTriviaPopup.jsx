import { useMemo } from 'react';

const triviaDeck = [
  "The first casino to host a cybersecurity summit was in Las Vegas in 2017.",
  "Card counting analogies inspired early anomaly detection models in fraud analytics.",
  "The word 'casino' originates from the Italian 'casa', meaning little house.",
  "Roulette's 666 nickname comes from the sum of all numbers on the wheel.",
  "Modern slot machines use cryptographically secure RNGs to foil predictive cheats."
];

const classNames = (...values) => values.filter(Boolean).join(' ');

export default function CasinoTriviaPopup({ onClose, anchor = 'top-right', forcedMessage }) {
  const message = useMemo(() => {
    if (forcedMessage) return forcedMessage;
    const index = Math.floor(Math.random() * triviaDeck.length);
    return triviaDeck[index];
  }, [forcedMessage]);

  const positionClass = {
    'top-right': 'top-6 right-6 origin-top-right',
    'top-left': 'top-6 left-6 origin-top-left',
    'bottom-right': 'bottom-6 right-6 origin-bottom-right',
    'bottom-left': 'bottom-6 left-6 origin-bottom-left'
  }[anchor];

  return (
    <aside
      className={classNames(
        'casino-trivia-popup fixed z-40 max-w-sm rounded-2xl border border-amber-400/70',
        'bg-black/70 backdrop-blur-xl text-amber-100 shadow-casino-glow p-5',
        positionClass
      )}
    >
      <h3 className="text-lg font-semibold uppercase tracking-widest text-amber-300 mb-2">
        Casino Trivia
      </h3>
      <p className="text-sm leading-relaxed text-amber-50/90">{message}</p>
      <button type="button" onClick={onClose} className="casino-button mt-4 w-full">
        Back to the tables
      </button>
    </aside>
  );
}
