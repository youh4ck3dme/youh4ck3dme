import ModuleCard from './ModuleCard';

export default function DevToolsDetectorCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="DevTools Detector"
      subtitle="Monitor debugger heuristics and overlay artefacts"
      icon="🛠️"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <dl className="module-metrics">
        <div>
          <dt>Breakpoint traces</dt>
          <dd>{result?.breakpoints ?? 'None'}</dd>
        </div>
        <div>
          <dt>Render delta</dt>
          <dd>{result?.renderDelta ?? '< 3ms'}</dd>
        </div>
        <div>
          <dt>Last inspector</dt>
          <dd>{result?.lastInspector ?? 'Not observed'}</dd>
        </div>
      </dl>
    </ModuleCard>
  );
}
