import { useEffect, useRef } from 'react';

export default function LogStream({ entries }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [entries]);

  if (!entries?.length) {
    return (
      <section className="log-stream empty">
        <p>No telemetry yet. Start a sweep to populate the log.</p>
      </section>
    );
  }

  return (
    <section className="log-stream" ref={containerRef}>
      <ul className="log-list">
        {entries.map((entry) => (
          <li key={entry.id} className="log-entry">
            <span className="log-timestamp">{entry.timeLabel}</span>
            <span className={`log-level ${entry.severity}`}>{entry.severity.toUpperCase()}</span>
            <p className="log-message">{entry.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
