import ModuleCard from './ModuleCard';

export default function MitmRadarCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="MITM Radar"
      subtitle="Sweeping the pit for rogue relays"
      icon="🛰️"
      accentColor="from-sky-400 via-indigo-500 to-purple-600"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <div className="flex flex-col gap-3">
        <div className="radar-grid" aria-hidden="true">
          <span className="radar-sweep" />
          <span className="radar-ping" />
          <span className="radar-ping delay" />
        </div>
        <p className="text-sm text-slate-100/80">
          Running TLS roulette, cipher drift detection, and rogue certificate hunts to keep
          syndicates from splicing your winnings.
        </p>
      </div>
    </ModuleCard>
  );
}
