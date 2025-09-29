import ModuleCard from './ModuleCard';

export default function WebRTCSpyglassCard({ result, onTriggerTrivia }) {
  return (
    <ModuleCard
      title="WebRTC Spyglass"
      subtitle="Watch peer-to-peer signalling for suspicious offers"
      icon="🔍"
      result={result}
      onTriggerTrivia={onTriggerTrivia}
    >
      <dl className="module-metrics">
        <div>
          <dt>Active peers</dt>
          <dd>{result?.activePeers ?? '0'}</dd>
        </div>
        <div>
          <dt>ICE anomalies</dt>
          <dd>{result?.iceAnomalies ?? 'None'}</dd>
        </div>
        <div>
          <dt>Bitrate floor</dt>
          <dd>{result?.bitrateFloor ?? '0.0 kbps'}</dd>
        </div>
      </dl>
    </ModuleCard>
  );
}
