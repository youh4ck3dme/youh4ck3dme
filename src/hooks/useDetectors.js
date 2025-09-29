import { useCallback, useMemo, useRef, useState } from 'react';

const createInitialResults = () => ({
  webview: {
    status: 'pending',
    details: 'Standing by on the casino floor for suspicious WebView croupiers.'
  },
  mitm: {
    status: 'pending',
    details: 'Listening for off-the-books relays in the TLS lounge.'
  },
  runtime: {
    status: 'pending',
    details: 'Awaiting dice rolls from runtime tamper sentries.'
  },
  devtools: {
    status: 'pending',
    details: 'Watching for the telltale glow of inspector windows.'
  },
  integrity: {
    status: 'pending',
    details: 'Stacks of assets ready for verification before the shuffle.'
  },
  webrtc: {
    status: 'pending',
    details: 'Spyglass polished, scanning for clandestine peer feeds.'
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

const buildOutcome = (status, details) => ({
  status,
  details,
  timestamp: Date.now()
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
      pass: 'No rogue bridges detected across hybrid pits.',
      warn: 'Detected altered user agent hooks; watch the progressive jackpots closely.',
      fail: 'Injected WebView clients detected skimming tokens!'
    }[status]),
  mitm: (status) =>
    ({
      pass: 'TLS tables locked tight with perfect forward secrecy.',
      warn: 'Cipher downgrade attempt shuffled into the deck — keep patrolling.',
      fail: 'Active MITM shim detected. Pull the plug!'
    }[status]),
  runtime: (status) =>
    ({
      pass: 'Runtime introspection reveals no illicit hooks.',
      warn: 'Possible jailbreak artifacts discovered; escalate monitoring.',
      fail: 'Runtime patching in progress! Reinforcements needed.'
    }[status]),
  devtools: (status) =>
    ({
      pass: 'No debugger traces — tables secure.',
      warn: 'Possible inspector heuristics triggered; dim the lights.',
      fail: 'Debugger attached to the pit boss console!'
    }[status]),
  integrity: (status) =>
    ({
      pass: 'Asset hashes align — chips verified genuine.',
      warn: 'Hash drift observed on auxiliary bundle; investigate cashier.',
      fail: 'Integrity failure! Assets swapped mid-shuffle.'
    }[status]),
  webrtc: (status) =>
    ({
      pass: 'Peer channels dormant; spyglasses see nothing.',
      warn: 'Background WebRTC channels observed renegotiating.',
      fail: 'Exfiltration via WebRTC feed detected!'
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
        runCheck(token, 'webview', 'Probing WebView bridges for native escalations.', async () => {
          await wait(600 + Math.random() * 400);
          const status = pickOutcome([
            ['pass', 0.65],
            ['warn', 0.25],
            ['fail', 0.1]
          ]);
          return buildOutcome(
            status,
            'Deep linking audits and certificate pinning checks completed.'
          );
        }),
        runCheck(token, 'mitm', 'Running TLS wheel to detect relays.', async () => {
          await wait(700 + Math.random() * 500);
          const status = pickOutcome([
            ['pass', 0.6],
            ['warn', 0.3],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Handshake analytics processed across cipher suites.');
        }),
        runCheck(token, 'runtime', 'Inspecting runtime memory tamper surfaces.', async () => {
          await wait(500 + Math.random() * 600);
          const status = pickOutcome([
            ['pass', 0.55],
            ['warn', 0.35],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Dynamic instrumentation and sandbox checks executed.');
        }),
        runCheck(token, 'devtools', 'Checking DevTools heuristics and overlay signals.', async () => {
          await wait(450 + Math.random() * 500);
          const status = pickOutcome([
            ['pass', 0.5],
            ['warn', 0.35],
            ['fail', 0.15]
          ]);
          return buildOutcome(status, 'Render loop jitter and protocol traps analysed.');
        }),
        runCheck(token, 'integrity', 'Validating bundle hashes and signatures.', async () => {
          await wait(800 + Math.random() * 400);
          const status = pickOutcome([
            ['pass', 0.7],
            ['warn', 0.2],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Asset manifest reconciliation complete.');
        }),
        runCheck(token, 'webrtc', 'Inspecting WebRTC signalling for hidden peers.', async () => {
          await wait(650 + Math.random() * 450);
          const status = pickOutcome([
            ['pass', 0.6],
            ['warn', 0.3],
            ['fail', 0.1]
          ]);
          return buildOutcome(status, 'Session description audits and ICE trickle analysis complete.');
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
    pushLog('info', 'Initiating multi-module casino sweep.');
    setResults((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = {
          ...next[key],
          status: 'scanning',
          details: 'Croupier is spinning up this check...'
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
      pushLog('success', 'Casino sweep completed without incident.');
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
