import React, { useState, useEffect } from 'react';
import { Navigation, Menu, Download, Zap, Database, Globe, RefreshCcw } from 'lucide-react';
import { NodeData, Alert } from './types';
import { MOCK_NODES_INITIAL, APP_NAME } from './constants';
import { generateMockNodeData, generateMockAlerts } from './services/mockService';

import StatCard from './components/StatCard';
import NodeList from './components/NodeList';
import { LatencyTpsChart } from './components/Charts';
import AlertsPanel from './components/AlertsPanel';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Data
  useEffect(() => {
    // Initial Seed
    const seedNodes = MOCK_NODES_INITIAL.map(n => generateMockNodeData(n));
    setNodes(seedNodes);
    setAlerts(generateMockAlerts());
    setLoading(false);
  }, []);

  // Simulate WebSocket / Polling updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => prevNodes.map(node => generateMockNodeData(node)));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const handleExportCsv = () => {
    const headers = "NodeID,Name,BlockHeight,Peers,Latency,TPS\n";
    const rows = nodes.map(n => `${n.id},${n.name},${n.metrics.blockHeight},${n.metrics.peers},${n.metrics.rpcLatency},${n.metrics.tps}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conflux-report-${Date.now()}.csv`;
    a.click();
  };

  // Aggregated Metrics
  const totalPeers = nodes.reduce((acc, curr) => acc + curr.metrics.peers, 0);
  const avgLatency = Math.floor(nodes.reduce((acc, curr) => acc + curr.metrics.rpcLatency, 0) / (nodes.length || 1));
  const avgGas = (nodes.reduce((acc, curr) => acc + curr.metrics.gasPrice, 0) / (nodes.length || 1)).toFixed(2);
  const latestBlock = Math.max(...nodes.map(n => n.metrics.blockHeight));
  
  // Use the history of the first node for the main chart for demo purposes
  const mainChartData = nodes[0]?.history || [];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex font-sans text-gray-900">
      
      {/* Sidebar - Simplified for layout */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed h-full z-10">
        <div className="p-8">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xl tracking-tight">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Zap size={18} fill="currentColor" />
                </div>
                {APP_NAME}
            </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
            <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium flex items-center gap-3 cursor-pointer">
                <Database size={20} />
                Dashboard
            </div>
            <div className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
                <Globe size={20} />
                Network Map
            </div>
            <div className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
                <RefreshCcw size={20} />
                Sync Status
            </div>
        </nav>

        <div className="p-4 m-4 bg-gray-900 rounded-2xl text-white">
            <h4 className="font-semibold mb-1">Status: Online</h4>
            <p className="text-xs text-gray-400 mb-3">Collector v1.4.2 active</p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Healthy
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Node Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Real-time metrics from {nodes.length} active nodes</p>
            </div>
            
            <div className="flex items-center gap-3">
                 <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <span>Last 24h</span>
                </button>
                <button 
                  onClick={handleExportCsv}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Latest Block" 
                value={`#${latestBlock.toLocaleString()}`} 
                icon={Database} 
                color="blue"
                trend="up"
                trendValue="+1 block/s"
            />
            <StatCard 
                title="Active Peers" 
                value={totalPeers} 
                subValue="Global"
                icon={Globe} 
                color="purple"
                trend="neutral"
                trendValue="Stable"
            />
            <StatCard 
                title="Avg Latency" 
                value={`${avgLatency}ms`} 
                icon={RefreshCcw} 
                color={avgLatency > 200 ? 'red' : 'green'}
                trend={avgLatency > 150 ? 'down' : 'up'}
                trendValue={avgLatency > 150 ? 'Spike detected' : 'Optimal'}
            />
            <StatCard 
                title="Gas Price" 
                value={avgGas} 
                subValue="Gwei"
                icon={Zap} 
                color="orange"
                trend="up"
                trendValue="+2.4%"
            />
        </div>

        {/* Middle Section: Chart & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-auto lg:h-[400px]">
            <div className="lg:col-span-2 h-full">
                <LatencyTpsChart data={mainChartData} />
            </div>
            <div className="h-full">
                <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            </div>
        </div>

        {/* Bottom Section: Node List */}
        <div className="mb-8">
            <NodeList nodes={nodes} />
        </div>

      </main>
    </div>
  );
};

export default App;