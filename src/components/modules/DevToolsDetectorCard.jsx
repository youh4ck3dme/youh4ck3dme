import ModuleCard from './ModuleCard';

export default function DevToolsDetectorCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="DevTools Detector"
      subtitle="Sniffing for open backroom windows"
      icon="🕵️"
      accentColor="from-rose-400 via-red-500 to-orange-500"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <div className="flex flex-col gap-3">
        <div className="laser-grid" aria-hidden="true">
          <span className="laser-beam" />
          <span className="laser-beam delay" />
          <span className="laser-beam delay-2" />
        </div>
        <p className="text-sm text-slate-100/80">
          Measuring render loop slowdowns, protocol taps, and debugger telltales to stop cheaters
          from cracking open the vault.
        </p>
      </div>
    </ModuleCard>
  );
}
