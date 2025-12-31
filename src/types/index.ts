// Module status types
export type ModuleStatus = 'idle' | 'running' | 'pass' | 'warning' | 'alert' | 'error';

// Detector result types
export interface DetectorResult {
  status: ModuleStatus;
  summary: string;
  details: string[];
  lastRun?: string;
}

// Module state types
export interface ModuleState {
  status: ModuleStatus;
  summary: string;
  details: string[];
  lastRun: string | null;
}

// All available module keys
export type ModuleKey = 'webview' | 'mitm' | 'runtime' | 'devtools' | 'integrity' | 'webrtc';

// Module definition type
export interface ModuleDefinition {
  name: string;
  detector: () => Promise<DetectorResult>;
}

// Telemetry entry types
export type LogLevel = 'info' | 'success' | 'warning' | 'alert';

export interface TelemetryEntry {
  id: string;
  timestamp: string;
  module: string;
  level: LogLevel;
  message: string;
}

// Control panel props types
export interface ControlPanelProps {
  onRunFullScan: () => void;
  onClearLogs: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  disabled: boolean;
  hasLogs: boolean;
}

// Module card props types
export interface ModuleCardProps {
  id: string;
  title: string;
  subtitle?: string;
  status: ModuleStatus;
  summary: string;
  details?: string[];
  onRun: () => void;
  disabled?: boolean;
  accent?: string;
  children: React.ReactNode;
}

// Telemetry log props types
export interface TelemetryLogProps {
  entries: TelemetryEntry[];
}

// Trivia popup props types
export interface CasinoTriviaPopupProps {
  trivia: string | null;
  onDismiss: () => void;
}

// Service worker message types
export interface IntegrityFailurePayload {
  url: string;
  expectedHash: string;
  actualHash: string;
}

export interface IntegrityOkPayload {
  url: string;
}

export type SwMessageType = 'integrity-failure' | 'integrity-ok';

export interface SwMessage {
  type: SwMessageType;
  payload?: IntegrityFailurePayload | IntegrityOkPayload;
}

