import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'blue' 
}) => {
  
  const colorStyles = {
    blue: 'text-blue-600',
    green: 'text-emerald-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
  };

  const borderStyles = {
     blue: 'border-l-blue-600',
     green: 'border-l-emerald-600',
     red: 'border-l-red-600',
     orange: 'border-l-orange-600',
     purple: 'border-l-purple-600',
  };

  return (
    <div className={`bg-white p-6 border border-zinc-200 border-l-4 ${borderStyles[color]} relative group hover:bg-zinc-50/50 hover:border-zinc-300 transition-colors duration-200`}>
      {/* Technical corner marker */}
      <div className="absolute top-0 right-0 p-1">
        <div className="w-1.5 h-1.5 bg-zinc-100 group-hover:bg-zinc-300 transition-colors"></div>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className={`flex items-center gap-2 ${colorStyles[color]}`}>
          <Icon size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Metric</span>
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-mono font-bold ${
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-zinc-400'
          }`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■'} {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tighter">{value}</span>
          {subValue && <span className="text-xs text-zinc-400 font-mono uppercase">{subValue}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;