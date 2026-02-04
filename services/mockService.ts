import { NodeData, NodeStatus, Alert } from '../types';

// Helper to generate random integer within range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// Helper to generate trend data
const generateHistory = () => {
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: randomInt(40, 150),
      tps: randomInt(20, 80),
    });
  }
  return data;
};

export const generateMockNodeData = (baseData: any): NodeData => {
  const isHealthy = baseData.status === 'HEALTHY';
  
  return {
    ...baseData,
    metrics: {
      blockHeight: 12450000 + randomInt(0, 100),
      epoch: 85000 + randomInt(0, 5),
      peers: isHealthy ? randomInt(40, 50) : randomInt(0, 5),
      tps: isHealthy ? randomInt(30, 90) : 0,
      gasPrice: randomInt(1, 5) + Math.random(),
      rpcLatency: isHealthy ? randomInt(45, 120) : randomInt(500, 2000),
      lastBlockTime: Date.now(),
    },
    system: {
      cpuUsage: randomInt(10, 80),
      ramUsage: randomInt(40, 90),
      diskUsage: 65,
      networkRx: randomInt(5, 50),
      networkTx: randomInt(5, 50),
    },
    history: generateHistory(),
  };
};

export const generateMockAlerts = (): Alert[] => [
  {
    id: 'a-1',
    nodeId: 'n-3',
    severity: 'critical',
    message: 'Sync stalled for > 500 blocks',
    timestamp: Date.now() - 1000 * 60 * 15,
    acknowledged: false,
  },
  {
    id: 'a-2',
    nodeId: 'n-2',
    severity: 'warning',
    message: 'High Latency (> 300ms) detected',
    timestamp: Date.now() - 1000 * 60 * 60,
    acknowledged: true,
  }
];
