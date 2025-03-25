export interface HostData {
  id: string;
  ipAddress: string;
  hostname: string;
  port: number;
  status: 'up' | 'down' | 'unknown';
  responseTime: number;
  bandwidth: number;
  latency: number;
  packetLoss: number;
  sslStatus: 'secure' | 'insecure' | 'expired' | 'unknown';
  openPorts: string[];
  vulnerabilities: string[];
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  lastCheck: Date;
  notes: string;
}

export interface StatusIndicatorProps {
  status: 'up' | 'down' | 'unknown' | 'secure' | 'insecure' | 'expired';
  text?: string;
}

export interface ScoutConfig {
  title: string;
  page_title: string;
  delimiter: string;
  teamNumber: number;
  sections: any[];
}

export interface ScoutField {
  title: string;
  description?: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'counter' | 'timer' | 'range';
  required: boolean;
  code: string;
  formResetBehavior: 'preserve' | 'increment' | 'reset';
  defaultValue: string | number | boolean;
  choices?: Record<string, string>;
  min?: number;
  max?: number;
  step?: number;
  outputType?: string;
}

export type PrematchField = ScoutField;