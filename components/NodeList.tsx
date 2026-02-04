import React from 'react';
import { NodeData, NodeStatus } from '../types';
import { MoreHorizontal, Server, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

interface NodeListProps {
  nodes: NodeData[];
}

const StatusBadge: React.FC<{ status: NodeStatus }> = ({ status }) => {
  const styles = {
    [NodeStatus.HEALTHY]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [NodeStatus.SYNCING]: 'bg-blue-100 text-blue-800 border-blue-200',
    [NodeStatus.STALLED]: 'bg-amber-100 text-amber-800 border-amber-200',
    [NodeStatus.OFFLINE]: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

const NodeList: React.FC<NodeListProps> = ({ nodes }) => {
  return (
    <div className="bg-white border border-zinc-200">
      <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-900"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Active Nodes</h3>
        </div>
        <button className="text-xs font-mono text-zinc-500 hover:text-zinc-900 hover:underline uppercase">:: View All Nodes</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 font-mono">ID / Endpoint</th>
              <th className="px-6 py-3 font-mono">Status</th>
              <th className="px-6 py-3 font-mono">Height / Epoch</th>
              <th className="px-6 py-3 font-mono">Peers</th>
              <th className="px-6 py-3 font-mono">Latency</th>
              <th className="px-6 py-3 font-mono">Ver</th>
              <th className="px-6 py-3 font-mono text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {nodes.map((node) => (
              <tr key={node.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="mr-3 text-zinc-300 group-hover:text-zinc-900 transition-colors">
                        <Server size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 font-sans">{node.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{node.endpoint}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={node.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-zinc-900 font-mono">#{node.metrics.blockHeight.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase">Epoch {node.metrics.epoch}</div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-zinc-600">
                  <span className="font-bold">{node.metrics.peers}</span><span className="text-zinc-300">/</span>50
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 ${node.metrics.rpcLatency > 200 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <span className={`text-sm font-mono font-bold ${node.metrics.rpcLatency > 200 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {node.metrics.rpcLatency}ms
                        </span>
                   </div>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                  {node.version}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodeList;