import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MODULE_DEFINITIONS = {
  webview: { name: 'WebView Hunter', detector: detectWebView },
  mitm: { name: 'MITM Radar', detector: detectMitm },
  runtime: { name: 'Runtime Monitor', detector: detectRuntime },
  devtools: { name: 'DevTools Detector', detector: detectDevTools },
  integrity: { name: 'Integrity Verifier', detector: detectIntegrity },
  webrtc: { name: 'WebRTC Spyglass', detector: detectWebRTC },
};

const CASINO_TRIVIA = [
  'The Monte Carlo Casino inspired the first roulette security sweep in 1842 to stop magnet rigging.',
  'Vegas sportsbooks still employ human “line readers” alongside AI, just in case the pit boss sees a con.',
  'Card counting is legal in Nevada, but casinos deploy heat maps to flag improbable blackjack streaks.',
  'Macau security teams once used infrared to catch ghost dealers swapping dice mid-roll.',
  'Atlantic City slot machines now log SHA-256 hashes after every firmware spin to flag tampering.',
];

const INITIAL_MODULE_STATE = Object.keys(MODULE_DEFINITIONS).reduce((acc, key) => {
  acc[key] = {
    status: 'idle',
    summary: 'Module primed. Awaiting a casino floor scan.',
    details: [],
    lastRun: null,
  };
  return acc;
}, {});

function useDetectors() {
  const [modules, setModules] = useState(INITIAL_MODULE_STATE);
  const [logs, setLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTrivia, setActiveTrivia] = useState(null);
  const triviaTimer = useRef(null);
  const logCounter = useRef(0);
  const swListenerAttached = useRef(false);

  const addLog = useCallback((level, moduleKey, message) => {
    logCounter.current += 1;
    const entry = {
      id: `${moduleKey}-${logCounter.current}`,
      timestamp: new Date().toLocaleTimeString(),
      module: moduleKey,
      level,
      message,
    };
    setLogs((previous) => [...previous.slice(-199), entry]);
  }, []);

  const setModuleRunning = useCallback((key) => {
    setModules((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: 'running',
        summary: 'Shuffling diagnostics…',
        details: [],
      },
    }));
  }, []);

  const finalizeModule = useCallback((key, nextState) => {
    setModules((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...nextState,
        lastRun: new Date().toISOString(),
      },
    }));
  }, []);

  const runModule = useCallback(
    async (key) => {
      if (!MODULE_DEFINITIONS[key]) {
        return;
      }
      setModuleRunning(key);
      addLog('info', MODULE_DEFINITIONS[key].name, 'Starting targeted scan.');
      try {
        const result = await MODULE_DEFINITIONS[key].detector();
        finalizeModule(key, result);
        const level = result.status === 'alert' ? 'alert' : result.status === 'warning' ? 'warning' : 'success';
        addLog(level, MODULE_DEFINITIONS[key].name, result.summary);
      } catch (error) {
        finalizeModule(key, {
          status: 'error',
          summary: 'Module faulted while probing environment.',
          details: [error.message],
        });
        addLog('alert', MODULE_DEFINITIONS[key].name, `Probe crashed: ${error.message}`);
      }
    },
    [addLog, finalizeModule, setModuleRunning],
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog('info', 'Control', 'Telemetry log cleared.');
  }, [addLog]);

  const dismissTrivia = useCallback(() => {
    setActiveTrivia(null);
    if (triviaTimer.current) {
      clearTimeout(triviaTimer.current);
      triviaTimer.current = null;
    }
  }, []);

  const runFullScan = useCallback(async () => {
    if (isScanning) {
      return;
    }
    setIsScanning(true);
    addLog('info', 'Control', 'Full scan initiated across all casino defenses.');
    if (triviaTimer.current) {
      clearTimeout(triviaTimer.current);
    }
    triviaTimer.current = setTimeout(() => {
      const trivia = CASINO_TRIVIA[Math.floor(Math.random() * CASINO_TRIVIA.length)];
      setActiveTrivia(trivia);
    }, 1500);

    for (const key of Object.keys(MODULE_DEFINITIONS)) {
      // eslint-disable-next-line no-await-in-loop
      await runModule(key);
    }

    if (triviaTimer.current) {
      clearTimeout(triviaTimer.current);
      triviaTimer.current = null;
    }
    setActiveTrivia(null);
    setIsScanning(false);
    addLog('success', 'Control', 'Full scan complete. Review telemetry for heat signatures.');
  }, [addLog, isScanning, runModule]);

  const exportLogs = useCallback(
    (format) => {
      if (logs.length === 0) {
        addLog('warning', 'Control', 'No telemetry to export. Run a scan first.');
        return;
      }

      const filename = `riggedguard-report-${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`;
      let content = '';
      let mime = 'application/json';

      if (format === 'csv') {
        mime = 'text/csv';
        const header = 'timestamp,module,level,message';
        const rows = logs.map((entry) =>
          [entry.timestamp, entry.module.replace(/,/g, ';'), entry.level, entry.message.replace(/,/g, ';')].join(','),
        );
        content = [header, ...rows].join('\n');
      } else {
        content = JSON.stringify(logs, null, 2);
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      addLog('info', 'Control', `Exported telemetry as ${format.toUpperCase()}.`);
    },
    [addLog, logs],
  );

  useEffect(() => () => {
    if (triviaTimer.current) {
      clearTimeout(triviaTimer.current);
    }
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || swListenerAttached.current) {
      return undefined;
    }
    const handler = (event) => {
      if (!event.data) return;
      const { type, payload } = event.data;
      if (type === 'integrity-failure') {
        addLog('alert', 'Integrity Verifier', `Service worker flagged ${payload.url}`);
        finalizeModule('integrity', {
          status: 'alert',
          summary: `Service worker reported tampering on ${payload.url}.`,
          details: [`Expected hash: ${payload.expectedHash}`, `Observed hash: ${payload.actualHash}`],
        });
      } else if (type === 'integrity-ok') {
        addLog('success', 'Integrity Verifier', 'Service worker integrity sweep clean.');
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    swListenerAttached.current = true;
    return () => {
      navigator.serviceWorker.removeEventListener('message', handler);
      swListenerAttached.current = false;
    };
  }, [addLog, finalizeModule]);

  return useMemo(
    () => ({
      modules,
      logs,
      isScanning,
      activeTrivia,
      runFullScan,
      runModule,
      clearLogs,
      exportLogs,
      dismissTrivia,
    }),
    [modules, logs, isScanning, activeTrivia, runFullScan, runModule, clearLogs, exportLogs, dismissTrivia],
  );
}

async function detectWebView() {
  const details = [];
  const ua = navigator.userAgent || 'unknown';
  let status = 'pass';

  if (/WebView|wv/.test(ua)) {
    status = 'warning';
    details.push(`User-Agent hints at embedded WebView: ${ua}`);
  } else {
    details.push('User-Agent does not declare obvious WebView tokens.');
  }

  if (window.webkit?.messageHandlers) {
    status = status === 'alert' ? 'alert' : 'warning';
    details.push(`Native message handlers detected: ${Object.keys(window.webkit.messageHandlers).join(', ')}`);
  } else {
    details.push('No exposed WebKit message handlers observed.');
  }

  const suspiciousGlobals = ['ReactNativeWebView', '__firebug__', '__nightmare'];
  const flagged = suspiciousGlobals.filter((key) => key in window);
  if (flagged.length > 0) {
    status = 'alert';
    details.push(`Instrumentation globals present: ${flagged.join(', ')}`);
  }

  const summary =
    status === 'alert'
      ? 'High-risk WebView instrumentation identified.'
      : status === 'warning'
        ? 'Embedded browser hints detected; keep surveillance tight.'
        : 'No intrusive WebView bridges in sight.';

  return { status, summary, details };
}

async function detectMitm() {
  const details = [];
  let status = 'pass';
  const probeUrl = 'https://self-signed.badssl.com/';
  const start = performance.now();
  try {
    await fetch(probeUrl, { mode: 'no-cors', cache: 'no-store' });
    const latency = Math.round(performance.now() - start);
    details.push(`Probe latency: ${latency}ms to ${probeUrl}`);
    if (latency > 1500) {
      status = 'warning';
      details.push('Slow TLS negotiation suggests proxy instrumentation.');
    } else {
      details.push('TLS probe returned quickly; no MITM lag spotted.');
    }
  } catch (error) {
    status = 'warning';
    details.push(`TLS probe blocked: ${error.message}`);
    if (/certificate/i.test(error.message) || /ssl/i.test(error.message)) {
      status = 'alert';
      details.push('Certificate failure indicates interception.');
    }
  }

  const summary =
    status === 'alert'
      ? 'Certificate anomaly screams MITM!'
      : status === 'warning'
        ? 'Potential proxy or TLS meddler detected; verify trust anchors.'
        : 'Network lane appears clear of sneaky dealers.';

  return { status, summary, details };
}

async function detectRuntime() {
  const details = [];
  let status = 'pass';

  const fetchSignature = Function.prototype.toString.call(window.fetch);
  if (!/\[native code\]/.test(fetchSignature)) {
    status = 'warning';
    details.push('fetch() no longer reports native code. Possible proxy wrapping.');
  } else {
    details.push('fetch() still advertises pristine native code.');
  }

  const consoleSignature = Function.prototype.toString.call(console.log);
  if (!/\[native code\]/.test(consoleSignature)) {
    status = 'warning';
    details.push('console.log patched — instrumentation may be siphoning logs.');
  }

  const descriptors = Object.getOwnPropertyDescriptor(window, 'localStorage');
  if (descriptors && descriptors.configurable) {
    status = 'warning';
    details.push('localStorage descriptor configurable; environment may be shimmed.');
  } else {
    details.push('Storage APIs locked down as expected.');
  }

  if (window.Proxy) {
    try {
      const proxyTest = new Proxy({}, {});
      if (typeof proxyTest !== 'object') {
        status = 'alert';
        details.push('Proxy baseline test failed — runtime tampering extreme.');
      }
    } catch (error) {
      status = 'alert';
      details.push(`Proxy construction exploded: ${error.message}`);
    }
  }

  const summary =
    status === 'alert'
      ? 'Runtime core invariants broken. Immediate response recommended.'
      : status === 'warning'
        ? 'Runtime hooks discovered; monitor for active cheats.'
        : 'Runtime surfaces remain pristine and untampered.';

  return { status, summary, details };
}

async function detectDevTools() {
  const details = [];
  let status = 'pass';

  const widthGap = Math.abs(window.outerWidth - window.innerWidth);
  const heightGap = Math.abs(window.outerHeight - window.innerHeight);
  if (widthGap > 200 || heightGap > 200) {
    status = 'warning';
    details.push('Viewport gap hints DevTools panes are open.');
  } else {
    details.push('Viewport gap minimal. No obvious DevTools docking.');
  }

  const t0 = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  const delta = performance.now() - t0;
  if (delta > 200) {
    status = 'alert';
    details.push(`Debugger induced pause ${Math.round(delta)}ms.`);
  } else {
    details.push('Debugger bait executed without extended pause.');
  }

  if (navigator.webdriver) {
    status = 'warning';
    details.push('webdriver flag present — automated harness may be attached.');
  }

  const summary =
    status === 'alert'
      ? 'Live debugger detected; protect the tables!'
      : status === 'warning'
        ? 'Debugger breadcrumbs observed. Stay vigilant.'
        : 'No DevTools heat signatures detected.';

  return { status, summary, details };
}

async function detectIntegrity() {
  const details = [];
  let status = 'pass';
  try {
    const manifestResponse = await fetch('/integrity-manifest.json', { cache: 'no-store' });
    if (!manifestResponse.ok) {
      throw new Error(`Integrity manifest unavailable (${manifestResponse.status}).`);
    }
    const manifest = await manifestResponse.json();
    const mismatches = [];
    for (const [path, expectedHash] of Object.entries(manifest)) {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) {
        mismatches.push(`${path} responded with ${response.status}`);
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      const buffer = await response.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buffer);
      const hash = arrayBufferToBase64(digest);
      if (hash !== expectedHash) {
        mismatches.push(`${path} hash mismatch`);
      }
    }
    if (mismatches.length > 0) {
      status = 'alert';
      details.push(...mismatches);
    } else {
      details.push('All monitored assets passed SHA-256 verification.');
    }
  } catch (error) {
    status = 'warning';
    details.push(error.message);
  }

  const summary =
    status === 'alert'
      ? 'Asset integrity failure! Bouncer rejecting tampered files.'
      : status === 'warning'
        ? 'Integrity sweep incomplete. Check service worker manifest.'
        : 'Static assets verified against expected fingerprints.';

  return { status, summary, details };
}

async function detectWebRTC() {
  const details = [];
  let status = 'pass';

  if (!window.RTCPeerConnection) {
    status = 'warning';
    details.push('RTCPeerConnection unavailable. WebRTC stack disabled or blocked.');
    return {
      status,
      summary: 'WebRTC stack missing — network reconnaissance limited.',
      details,
    };
  }

  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const connection = new RTCPeerConnection(configuration);
  const candidates = [];

  try {
    connection.createDataChannel('scan');
    const offer = await connection.createOffer({ iceRestart: true });
    await connection.setLocalDescription(offer);

    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 1500);
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          candidates.push(event.candidate.candidate);
        } else {
          clearTimeout(timeout);
          resolve();
        }
      };
    });
  } catch (error) {
    status = 'warning';
    details.push(`WebRTC negotiation failed: ${error.message}`);
  } finally {
    connection.close();
  }

  if (candidates.length === 0) {
    details.push('No ICE candidates gathered. VPN or firewall may be cloaking endpoints.');
    status = status === 'pass' ? 'warning' : status;
  } else {
    details.push(`Collected ${candidates.length} ICE candidates.`);
    const relayCandidates = candidates.filter((cand) => cand.includes('relay'));
    if (relayCandidates.length > 0) {
      status = 'warning';
      details.push('Relay candidates indicate TURN/proxy usage.');
    }
    const privateCandidates = candidates.filter((cand) => /(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01]))/.test(cand));
    if (privateCandidates.length === 0) {
      status = 'warning';
      details.push('No private IP candidates; device may be masking LAN presence.');
    }
  }

  const summary =
    status === 'alert'
      ? 'Malicious peers latched onto WebRTC ice — high risk!'
      : status === 'warning'
        ? 'Anomalous WebRTC topology detected. Inspect peer list.'
        : 'WebRTC network surface looks casino-floor clean.';

  return { status, summary, details };
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export default useDetectors;
