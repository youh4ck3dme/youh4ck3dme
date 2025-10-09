const classNames = (...values) => values.filter(Boolean).join(' ');

const statusPalette = {
  pending: 'bg-slate-800/70 text-slate-200 border-slate-600',
  scanning: 'bg-purple-900/70 text-purple-100 border-purple-500 shadow-casino-glow',
  pass: 'bg-emerald-900/70 text-emerald-100 border-emerald-500 shadow-casino-glow',
  warn: 'bg-amber-900/70 text-amber-100 border-amber-500 shadow-casino-glow',
  fail: 'bg-rose-900/70 text-rose-100 border-rose-500 shadow-casino-glow'
};

const statusLabels = {
  pending: 'Awaiting spin',
  scanning: 'Spinning...',
  pass: 'All clear',
  warn: 'Keep watching',
  fail: 'Hit detected'
};

export default function ModuleCard({
  title,
  subtitle,
  icon,
  accentColor = 'from-purple-500 via-fuchsia-500 to-rose-500',
  result,
  onTriggerTrivia,
  children
}) {
  const status = result?.status ?? 'pending';
  const details = result?.details ?? 'Awaiting the dealer to flip the cards.';
  const chipClass = `bg-gradient-to-br ${accentColor}`;

  return (
    <article
      className={classNames(
        'module-card relative overflow-hidden rounded-3xl border px-6 py-5 transition-all duration-500',
        'backdrop-blur-xl shadow-2xl flex flex-col gap-4',
        statusPalette[status] ?? statusPalette.pending
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="casino-grid" />
        <div className="casino-lights" />
      </div>
      <header className="relative flex items-start gap-4">
        <div
          className={classNames(
            'h-14 w-14 flex items-center justify-center rounded-full text-2xl font-black text-white',
            chipClass,
            'chip-spin'
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-wide uppercase drop-shadow-md">{title}</h2>
          <p className="text-sm text-slate-200/80">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Status</p>
          <p className="font-semibold text-base text-slate-50">{statusLabels[status] ?? statusLabels.pending}</p>
        </div>
      </header>
      <p className="relative text-sm text-slate-200/90 leading-relaxed">{details}</p>
      <div className="relative flex-1 min-h-[120px] flex flex-col justify-between">
        <div className="flex-1">{children}</div>
        <footer className="mt-4 flex items-center justify-between text-xs text-slate-300/80">
          <span className="tracking-wide uppercase">Telemetry synced</span>
          <button
            type="button"
            onClick={onTriggerTrivia}
            className="casino-button text-xs"
          >
            Deal trivia
          </button>
        </footer>
      </div>
    </article>
  );
}
