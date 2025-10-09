import ModuleCard from './ModuleCard';

export default function WebRTCSpyglassCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="WebRTC Spyglass"
      subtitle="Peeking at the surveillance feeds"
      icon="🎥"
      accentColor="from-blue-400 via-cyan-500 to-indigo-500"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <div className="flex flex-col gap-3">
        <div className="camera-feed" aria-hidden="true">
          <span className="feed-scan" />
        </div>
        <p className="text-sm text-slate-100/80">
          Inspecting peer connections, renegotiation traps, and device leaks so no spyglass catches
          your hand signals.
        </p>
      </div>
    </ModuleCard>
  );
}
