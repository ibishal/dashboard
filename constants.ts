import { ChartArea, Server, Activity, AlertTriangle, Cpu, HardDrive, Share2 } from 'lucide-react';

export const APP_NAME = "Conflux Pulse";

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', icon: ChartArea, active: true },
  { name: 'Nodes', icon: Server, active: false },
  { name: 'Alerts', icon: AlertTriangle, active: false },
  { name: 'System Resources', icon: Cpu, active: false },
];

export const MOCK_NODES_INITIAL = [
  {
    id: 'n-1',
    name: 'Mainnet RPC Primary',
    endpoint: 'https://main.confluxrpc.com',
    status: 'HEALTHY',
    version: '2.3.0',
  },
  {
    id: 'n-2',
    name: 'Backup Validator 01',
    endpoint: '10.0.0.42:12537',
    status: 'SYNCING',
    version: '2.3.0',
  },
  {
    id: 'n-3',
    name: 'Archive Node East',
    endpoint: '10.0.0.45:12537',
    status: 'STALLED',
    version: '2.2.1',
  }
];
