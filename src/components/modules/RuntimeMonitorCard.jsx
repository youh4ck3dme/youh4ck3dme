import ModuleCard from './ModuleCard';

export default function RuntimeMonitorCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="Runtime Monitor"
      subtitle="Watching the dealer's hands in real time"
      icon="🎲"
      accentColor="from-emerald-400 via-lime-500 to-amber-500"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <div className="flex flex-col gap-3">
        <div className="dice-table" aria-hidden="true">
          <div className="dice" />
          <div className="dice shadow" />
        </div>
        <p className="text-sm text-slate-100/80">
          Monitoring hooks, tamper alarms, and runtime patches for sleight-of-hand attempts in
          native code and JavaScript seats.
        </p>
      </div>
    </ModuleCard>
  );
}
