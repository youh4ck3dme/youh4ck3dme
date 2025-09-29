import ModuleCard from './ModuleCard';

export default function WebViewHunterCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="WebView Hunter"
      subtitle="Inspect hybrid surfaces for injected bridges"
      icon="🛰️"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <dl className="module-metrics">
        <div>
          <dt>Bridge hooks</dt>
          <dd>{result?.bridgeHooks ?? '0 detected'}</dd>
        </div>
        <div>
          <dt>Pinning status</dt>
          <dd>{result?.pinning ?? 'Validated'}</dd>
        </div>
        <div>
          <dt>Last anomaly</dt>
          <dd>{result?.lastAnomaly ?? 'None in past 24h'}</dd>
        </div>
      </dl>
    </ModuleCard>
  );
}
