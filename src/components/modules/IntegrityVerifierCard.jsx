import ModuleCard from './ModuleCard';

export default function IntegrityVerifierCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="Integrity Verifier"
      subtitle="Validate asset signatures and runtime hashes"
      icon="🧾"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <dl className="module-metrics">
        <div>
          <dt>Manifest drift</dt>
          <dd>{result?.manifestDrift ?? '0 files'}</dd>
        </div>
        <div>
          <dt>Signature policy</dt>
          <dd>{result?.signaturePolicy ?? 'Enforced'}</dd>
        </div>
        <div>
          <dt>Checksum window</dt>
          <dd>{result?.checksumWindow ?? '15m'}</dd>
        </div>
      </dl>
    </ModuleCard>
  );
}
