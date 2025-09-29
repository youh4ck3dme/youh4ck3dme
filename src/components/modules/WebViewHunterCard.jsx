import ModuleCard from './ModuleCard';

export default function WebViewHunterCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="WebView Hunter"
      subtitle="Patrolling hybrid surfaces for injected dealers"
      icon="🎰"
      accentColor="from-amber-400 via-rose-500 to-purple-500"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <div className="flex flex-col gap-3">
        <div className="slot-machine" aria-hidden="true">
          <div className="slot-reel" />
          <div className="slot-reel" />
          <div className="slot-reel" />
        </div>
        <p className="text-sm text-slate-100/80">
          Inspecting DOM bridge boundaries, signature overrides, and certificate pinning routes
          to catch tampered tables before they can cash out.
        </p>
      </div>
    </ModuleCard>
  );
}
