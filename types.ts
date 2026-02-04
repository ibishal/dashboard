export enum NodeStatus {
  SYNCING = 'SYNCING',
  HEALTHY = 'HEALTHY',
  STALLED = 'STALLED',
  OFFLINE = 'OFFLINE',
}

export interface SystemStats {
  cpuUsage: number; // percentage
  ramUsage: number; // percentage
  diskUsage: number; // percentage
  networkRx: number; // MB/s
  networkTx: number; // MB/s
}

export interface ConfluxMetrics {
  blockHeight: number;
  epoch: number;
  peers: number;
  tps: number;
  gasPrice: number; // in Gwei
  rpcLatency: number; // in ms
  lastBlockTime: number; // timestamp
}

export interface NodeData {
  id: string;
  name: string;
  endpoint: string;
  status: NodeStatus;
  version: string;
  metrics: ConfluxMetrics;
  system: SystemStats;
  history: {
    time: string;
    latency: number;
    tps: number;
  }[];
}

export interface Alert {
  id: string;
  nodeId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}
