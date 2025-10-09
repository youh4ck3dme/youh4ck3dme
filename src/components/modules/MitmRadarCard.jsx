import ModuleCard from './ModuleCard';

export default function MitmRadarCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="TLS & MITM Radar"
      subtitle="Analyse transport surfaces for interception attempts"
      icon="📡"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <dl className="module-metrics">
        <div>
          <dt>Handshake score</dt>
          <dd>{result?.handshakeScore ?? 'A+'}</dd>
        </div>
        <div>
          <dt>Downgrade attempts</dt>
          <dd>{result?.downgrades ?? '0 observed'}</dd>
        </div>
        <div>
          <dt>Pinning coverage</dt>
          <dd>{result?.pinningCoverage ?? '100%'}</dd>
        </div>
      </dl>
    </ModuleCard>
  );
}
