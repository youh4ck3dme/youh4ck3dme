import { useMemo } from 'react';

const insightDeck = [
  'Jailbreak detection signals should combine file-system probes with sandbox policy checks to avoid false positives.',
  'Collect TLS cipher telemetry to prove pinning is enforced, not just configured.',
  'Monitor WebRTC renegotiations—sudden bitrate drops often precede exfiltration attempts.',
  'Runtime tampering indicators benefit from measuring unexpected dylib loads over time.',
  'Hash manifests catch offline tampering only when rotated frequently. Automate the cadence.'
];

const anchorClass = {
  'top-right': 'anchor-top-right',
  'top-left': 'anchor-top-left',
  'bottom-right': 'anchor-bottom-right',
  'bottom-left': 'anchor-bottom-left'
};

export default function CasinoTriviaPopup({ onClose, anchor = 'top-right', forcedMessage }) {
  const message = useMemo(() => {
    if (forcedMessage) return forcedMessage;
    const index = Math.floor(Math.random() * insightDeck.length);
    return insightDeck[index];
  }, [forcedMessage]);

  return (
    <aside className={`security-insight ${anchorClass[anchor] ?? anchorClass['top-right']}`}>
      <h3>Security insight</h3>
      <p>{message}</p>
      <button type="button" onClick={onClose} className="app-button primary">
        Close
      </button>
    </aside>
  );
}
