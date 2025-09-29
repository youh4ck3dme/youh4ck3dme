import ModuleCard from './ModuleCard';

export default function RuntimeMonitorCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="Runtime Monitor"
      subtitle="Detect jailbreak artefacts and dynamic instrumentation"
      icon="🧬"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <dl className="module-metrics">
        <div>
          <dt>Sandbox flags</dt>
          <dd>{result?.sandboxFlags ?? 'Clear'}</dd>
        </div>
        <div>
          <dt>Process anomalies</dt>
          <dd>{result?.processAnomalies ?? '0'}</dd>
        </div>
        <div>
          <dt>Kernel hooks</dt>
          <dd>{result?.kernelHooks ?? 'None'}</dd>
        </div>
      </dl>
    </ModuleCard>
  );
}
