import { useCallback, useMemo, useRef, useState } from 'react';

const createInitialResults = () => ({
  webview: {
    status: 'pending',
    details: 'Awaiting next hybrid surface assessment.',
    bridgeHooks: '-',
    pinning: '-',
    lastAnomaly: '-'
  },
  mitm: {
    status: 'pending',
    details: 'TLS checks will populate on scan.',
    handshakeScore: '-',
    downgrades: '-',
    pinningCoverage: '-'
  },
  runtime: {
    status: 'pending',
    details: 'Runtime telemetry will appear after the sweep.',
    sandboxFlags: '-',
    processAnomalies: '-',
    kernelHooks: '-'
  },
  devtools: {
    status: 'pending',
    details: 'Debugger heuristics will update after a run.',
    breakpoints: '-',
    renderDelta: '-',
    lastInspector: '-'
  },
  integrity: {
    status: 'pending',
    details: 'Asset verification pending.',
    manifestDrift: '-',
    signaturePolicy: '-',
    checksumWindow: '-'
  },
  webrtc: {
    status: 'pending',
    details: 'Peer telemetry ready for the next pass.',
    activePeers: '-',
    iceAnomalies: '-',
    bitrateFloor: '-'
  }
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pickOutcome = (weights) => {
  const roll = Math.random();
  let cumulative = 0;
  for (const [status, weight] of weights) {
    cumulative += weight;
    if (roll <= cumulative) return status;
  }
  return weights[weights.length - 1][0];
};

const randomInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const buildOutcome = (status, details, extra = {}) => ({
  status,
  details,
  timestamp: Date.now(),
  ...extra
});

const severityMap = {
  pass: 'success',
  warn: 'warning',
  fail: 'alert',
  scanning: 'info',
  pending: 'info'
};

const formatMessage = {
  webview: (status) =>
    ({
      pass: 'Hybrid bridge checks completed with no suspicious hooks.',
      warn: 'Potentially unsafe JavaScript bridge detected.',
      fail: 'WebView tampering confirmed. Block impacted flows.'
    }[status]),
  mitm: (status) =>
    ({
      pass: 'TLS posture validated with healthy cipher usage.',
      warn: 'Observed a downgraded handshake. Review certificate policy.',
      fail: 'Transport interception detected. Rotate credentials immediately.'
    }[status]),
  runtime: (status) =>
    ({
      pass: 'Runtime environment is consistent with hardened baseline.',
      warn: 'Jailbreak indicators detected. Increase monitoring.',
      fail: 'Runtime tampering active. Trigger incident response.'
    }[status]),
  devtools: (status) =>
    ({
      pass: 'No debugger artefacts observed during sampling.',
      warn: 'Debugger heuristics triggered recently.',
      fail: 'Debugger attached now. Close sensitive sessions.'
    }[status]),
  integrity: (status) =>
    ({
      pass: 'Bundle signatures match the reference manifest.',
      warn: 'Minor manifest drift detected. Review deployment pipeline.',
      fail: 'Integrity failure detected. Replace compromised assets.'
    }[status]),
  webrtc: (status) =>
    ({
      pass: 'No suspicious peer traffic detected.',
      warn: 'Unexpected ICE renegotiation observed.',
      fail: 'WebRTC exfiltration likely underway. Contain immediately.'
    }[status])
};

const formatTimeLabel = (timestamp) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(timestamp));

export default function useDetectors() {
  const [results, setResults] = useState(createInitialResults);
  const [logs, setLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanState, setScanState] = useState('idle');
  const [lastRunAt, setLastRunAt] = useState(null);

  const runToken = useRef(0);
  const haltedRun = useRef(false);

  const pushLog = useCallback((severity, message) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      severity,
      message,
      timestamp: Date.now()
    };
    entry.timeLabel = formatTimeLabel(entry.timestamp);
    setLogs((prev) => [...prev, entry]);
  }, []);

  const updateResult = useCallback((moduleKey, partial) => {
    setResults((prev) => ({
      ...prev,
      [moduleKey]: {
        ...(prev[moduleKey] ?? {}),
        ...partial
      }
    }));
  }, []);

  const resetResults = useCallback(() => {
    setResults(createInitialResults());
  }, []);

  const runCheck = useCallback(
    async (token, moduleKey, label, executor) => {
      pushLog('info', label);
      const outcome = await executor();
      if (runToken.current !== token) return;
      updateResult(moduleKey, outcome);
      const severity = severityMap[outcome.status] ?? 'info';
      const messageFactory = formatMessage[moduleKey];
      if (messageFactory) {
        pushLog(severity, messageFactory(outcome.status));
      }
    },
    [pushLog, updateResult]
  );

  const orchestrateScan = useCallback(
    async (token) => {
      await Promise.all([
        runCheck(token, 'webview', 'Auditing WebView bridges and certificate pinning.', async () => {
          await wait(600 + Math.random() * 400);
          const status = pickOutcome([
            ['pass', 0.65],
            ['warn', 0.25],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Hybrid context audit complete.', {
            bridgeHooks: status === 'pass' ? '0 detected' : `${randomInt(1, 3)} flagged`,
            pinning: status === 'fail' ? 'Bypassed' : 'Validated',
            lastAnomaly: status === 'pass' ? 'None in past 24h' : 'During latest sweep'
          });
        }),
        runCheck(token, 'mitm', 'Evaluating TLS posture and downgrade resilience.', async () => {
          await wait(700 + Math.random() * 500);
          const status = pickOutcome([
            ['pass', 0.6],
            ['warn', 0.3],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Transport analytics finished.', {
            handshakeScore: status === 'pass' ? 'A+' : status === 'warn' ? 'B-' : 'D',
            downgrades: status === 'fail' ? `${randomInt(2, 4)} attempts` : status === 'warn' ? '1 attempt' : '0 observed',
            pinningCoverage: status === 'fail' ? '62%' : status === 'warn' ? '78%' : '100%'
          });
        }),
        runCheck(token, 'runtime', 'Assessing runtime protections and sandbox health.', async () => {
          await wait(500 + Math.random() * 600);
          const status = pickOutcome([
            ['pass', 0.55],
            ['warn', 0.35],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Runtime instrumentation sweep complete.', {
            sandboxFlags: status === 'pass' ? 'Clear' : status === 'warn' ? 'Degraded' : 'Compromised',
            processAnomalies: status === 'pass' ? '0' : `${randomInt(1, 5)}`,
            kernelHooks: status === 'fail' ? 'Detected' : 'None'
          });
        }),
        runCheck(token, 'devtools', 'Sampling debugger heuristics and overlays.', async () => {
          await wait(450 + Math.random() * 500);
          const status = pickOutcome([
            ['pass', 0.5],
            ['warn', 0.35],
            ['fail', 0.15]
          ]);
          return buildOutcome(status, 'Debugger detection pass completed.', {
            breakpoints: status === 'pass' ? 'None' : `${randomInt(1, 4)} traces`,
            renderDelta: status === 'pass' ? '< 3ms' : status === 'warn' ? '6ms' : '15ms',
            lastInspector: status === 'pass' ? 'Not observed' : 'Within last sweep'
          });
        }),
        runCheck(token, 'integrity', 'Verifying bundle signatures and manifests.', async () => {
          await wait(800 + Math.random() * 400);
          const status = pickOutcome([
            ['pass', 0.7],
            ['warn', 0.2],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Asset verification finished.', {
            manifestDrift: status === 'pass' ? '0 files' : status === 'warn' ? `${randomInt(1, 2)} files` : `${randomInt(3, 6)} files`,
            signaturePolicy: status === 'fail' ? 'Bypassed' : 'Enforced',
            checksumWindow: status === 'pass' ? '15m' : '5m'
          });
        }),
        runCheck(token, 'webrtc', 'Inspecting WebRTC signalling for hidden peers.', async () => {
          await wait(650 + Math.random() * 450);
          const status = pickOutcome([
            ['pass', 0.6],
            ['warn', 0.3],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'WebRTC telemetry updated.', {
            activePeers: status === 'pass' ? '0' : `${randomInt(1, 3)}`,
            iceAnomalies: status === 'pass' ? 'None' : status === 'warn' ? 'Low severity' : 'High severity',
            bitrateFloor: status === 'fail' ? '512 kbps' : status === 'warn' ? '160 kbps' : '0.0 kbps'
          });
        })
      ]);
    },
    [runCheck]
  );

  const startScan = useCallback(async () => {
    if (isScanning) return;
    setIsScanning(true);
    haltedRun.current = false;
    setScanState('scanning');
    runToken.current += 1;
    const token = runToken.current;
    pushLog('info', 'Initiating multi-module security sweep.');
    setResults((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = {
          ...next[key],
          status: 'scanning',
          details: 'Scan in progress — collecting telemetry.'
        };
      }
      return next;
    });

    try {
      await orchestrateScan(token);
      if (runToken.current !== token || haltedRun.current) return;
      setIsScanning(false);
      setScanState('completed');
      const finishedAt = Date.now();
      setLastRunAt(finishedAt);
      pushLog('success', 'Security sweep completed. Review module results.');
    } catch (error) {
      if (runToken.current !== token) return;
      setIsScanning(false);
      setScanState('halted');
      pushLog('alert', `Scan aborted due to unexpected error: ${error.message ?? error}`);
    }
  }, [isScanning, orchestrateScan, pushLog]);

  const stopScan = useCallback(() => {
    if (!isScanning) return;
    haltedRun.current = true;
    runToken.current += 1;
    setIsScanning(false);
    setScanState('halted');
    setResults((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key]?.status === 'scanning') {
          next[key] = {
            ...next[key],
            status: 'warn',
            details: 'Scan halted before this module finished its run.'
          };
        }
      }
      return next;
    });
    pushLog('warning', 'Scan halted by operator before completion.');
  }, [isScanning, pushLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const exportLogs = useCallback(() => {
    return JSON.stringify(
      logs.map(({ id, severity, message, timestamp }) => ({ id, severity, message, timestamp })),
      null,
      2
    );
  }, [logs]);

  const summary = useMemo(() => {
    const totals = { pass: 0, warn: 0, fail: 0 };
    for (const moduleKey of Object.keys(results)) {
      const status = results[moduleKey]?.status;
      if (status && totals[status] !== undefined) {
        totals[status] += 1;
      }
    }
    return totals;
  }, [results]);

  return {
    results,
    logs,
    isScanning,
    scanState,
    lastRunAt,
    summary,
    startScan,
    stopScan,
    resetResults,
    clearLogs,
    exportLogs
  };
}
