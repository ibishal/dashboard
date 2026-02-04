import React from 'react';
import { Alert } from '../types';
import { Bell, Check, Clock, AlertTriangle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg text-red-500">
                <Bell size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
        </div>
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
            {activeAlerts.length}
        </span>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Check size={48} className="mx-auto mb-2 opacity-20" />
            <p>All systems operational</p>
          </div>
        ) : (
          activeAlerts.map(alert => (
            <div key={alert.id} className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                    <AlertTriangle size={18} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{alert.message}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="font-mono">{alert.nodeId}</span>
                    </div>
                </div>
              </div>
              <button 
                onClick={() => onAcknowledge(alert.id)}
                className="mt-3 w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                Acknowledge
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
        <button className="w-full text-center text-sm text-gray-500 hover:text-gray-900 font-medium">
            View Alert History
        </button>
      </div>
    </div>
  );
};

export default AlertsPanel;