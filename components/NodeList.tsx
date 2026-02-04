import React from 'react';
import { NodeData, NodeStatus } from '../types';
import { MoreVertical, Server, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

interface NodeListProps {
  nodes: NodeData[];
}

const StatusBadge: React.FC<{ status: NodeStatus }> = ({ status }) => {
  const styles = {
    [NodeStatus.HEALTHY]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [NodeStatus.SYNCING]: 'bg-blue-100 text-blue-700 border-blue-200',
    [NodeStatus.STALLED]: 'bg-amber-100 text-amber-700 border-amber-200',
    [NodeStatus.OFFLINE]: 'bg-red-100 text-red-700 border-red-200',
  };

  const icons = {
    [NodeStatus.HEALTHY]: ShieldCheck,
    [NodeStatus.SYNCING]: Activity,
    [NodeStatus.STALLED]: AlertCircle,
    [NodeStatus.OFFLINE]: AlertCircle,
  };
  
  const Icon = icons[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <Icon size={12} className="mr-1.5" />
      {status}
    </span>
  );
};

const NodeList: React.FC<NodeListProps> = ({ nodes }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Monitored Nodes</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-3">Node Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Block Height</th>
              <th className="px-6 py-3">Peers</th>
              <th className="px-6 py-3">Latency</th>
              <th className="px-6 py-3">Version</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {nodes.map((node) => (
              <tr key={node.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-3">
                        <Server size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{node.name}</div>
                      <div className="text-xs text-gray-500">{node.endpoint}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={node.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">#{node.metrics.blockHeight.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Epoch {node.metrics.epoch}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {node.metrics.peers} / 50
                </td>
                <td className="px-6 py-4">
                   <span className={`text-sm font-medium ${node.metrics.rpcLatency > 200 ? 'text-amber-600' : 'text-emerald-600'}`}>
                     {node.metrics.rpcLatency}ms
                   </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  v{node.version}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
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