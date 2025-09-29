import ModuleCard from './ModuleCard';

export default function IntegrityVerifierCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="Integrity Verifier"
      subtitle="Hashing chips before they hit the felt"
      icon="💎"
      accentColor="from-cyan-400 via-teal-500 to-emerald-500"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <div className="flex flex-col gap-3">
        <div className="card-stack" aria-hidden="true">
          <span className="card" />
          <span className="card second" />
          <span className="card third" />
        </div>
        <p className="text-sm text-slate-100/80">
          Verifying bundle signatures, asset digests, and jailbreak guards so your stack stays
          legit when the stakes go neon.
        </p>
      </div>
    </ModuleCard>
  );
}
