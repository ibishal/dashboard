import React, { useState, useEffect } from 'react';
import { Download, Zap, Database, Globe, RefreshCcw, LayoutGrid, Terminal, Cpu } from 'lucide-react';
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
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 font-mono">
            <div className="w-16 h-16 border-4 border-zinc-900 border-t-transparent animate-spin mb-4"></div>
            <div className="uppercase tracking-widest text-sm font-bold">Initializing System...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans text-zinc-900 bg-zinc-100">
      
      {/* Sidebar - Sharp & Technical */}
      <aside className="w-72 bg-white border-r border-zinc-200 hidden lg:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center gap-3 text-zinc-900 font-bold text-xl tracking-tighter uppercase">
                <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-white">
                    <Zap size={18} fill="currentColor" />
                </div>
                {APP_NAME}
            </div>
            <div className="mt-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest pl-11">
                v1.4.2 [BETA]
            </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-1">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 pl-2">Main Menu</div>
            <div className="group flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white font-medium text-sm cursor-pointer border border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <LayoutGrid size={18} />
                <span className="uppercase tracking-wide">Dashboard</span>
            </div>
            <div className="group flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium text-sm cursor-pointer border border-transparent hover:border-zinc-200 transition-all">
                <Globe size={18} />
                <span className="uppercase tracking-wide">Network Map</span>
            </div>
            <div className="group flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium text-sm cursor-pointer border border-transparent hover:border-zinc-200 transition-all">
                <Terminal size={18} />
                <span className="uppercase tracking-wide">Node Console</span>
            </div>
            <div className="group flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium text-sm cursor-pointer border border-transparent hover:border-zinc-200 transition-all">
                <Cpu size={18} />
                <span className="uppercase tracking-wide">Resources</span>
            </div>
        </nav>

        <div className="p-6 border-t border-zinc-200 bg-zinc-50">
            <div className="border border-zinc-200 bg-white p-4">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-900">System Status</h4>
                    <div className="w-2 h-2 bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="font-mono text-[10px] text-zinc-500 space-y-1">
                    <div className="flex justify-between">
                        <span>UPTIME</span>
                        <span>14D 02H 12M</span>
                    </div>
                    <div className="flex justify-between">
                        <span>COLLECTOR</span>
                        <span className="text-emerald-600">ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 lg:p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-zinc-200 pb-6">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 uppercase tracking-tighter">Mission Control</h1>
                <p className="text-zinc-500 text-xs font-mono mt-1 uppercase tracking-wide">
                    System Overview :: {nodes.length} Nodes Active :: Zone US-EAST
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                 <div className="hidden md:flex items-center px-3 py-2 bg-white border border-zinc-200 text-xs font-mono text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-zinc-300 mr-2"></span>
                    AUTO-REFRESH: 3s
                 </div>
                <button 
                  onClick={handleExportCsv}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-zinc-900 border border-zinc-900 hover:bg-zinc-800 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all uppercase tracking-wide"
                >
                    <Download size={14} />
                    Export Data
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
                trendValue="+1.0/s"
            />
            <StatCard 
                title="Active Peers" 
                value={totalPeers} 
                subValue="GLOBAL"
                icon={Globe} 
                color="purple"
                trend="neutral"
                trendValue="STABLE"
            />
            <StatCard 
                title="Avg Latency" 
                value={`${avgLatency}ms`} 
                icon={RefreshCcw} 
                color={avgLatency > 200 ? 'red' : 'green'}
                trend={avgLatency > 150 ? 'down' : 'up'}
                trendValue={avgLatency > 150 ? 'LAG DETECTED' : 'OPTIMAL'}
            />
            <StatCard 
                title="Gas Price" 
                value={avgGas} 
                subValue="GWEI"
                icon={Zap} 
                color="orange"
                trend="up"
                trendValue="+2.4%"
            />
        </div>

        {/* Middle Section: Chart & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 lg:h-[450px]">
            <div className="lg:col-span-2 h-full min-h-[400px]">
                <LatencyTpsChart data={mainChartData} />
            </div>
            <div className="h-full min-h-[400px]">
                <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            </div>
        </div>

        {/* Bottom Section: Node List */}
        <div className="mb-12">
            <NodeList nodes={nodes} />
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-200 pt-6 flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase">
            <div>Conflux Pulse Dashboard © 2024</div>
            <div className="flex gap-4">
                <span className="cursor-pointer hover:text-zinc-900">Documentation</span>
                <span className="cursor-pointer hover:text-zinc-900">API Status</span>
                <span className="cursor-pointer hover:text-zinc-900">Support</span>
            </div>
        </footer>

      </main>
    </div>
  );
};

export default App;