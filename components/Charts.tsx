import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface LatencyChartProps {
  data: { time: string; latency: number; tps: number }[];
}

type ChartType = 'area' | 'bar' | 'line';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-3 shadow-sm">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-mono">{label}</p>
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500"></div>
                <p className="text-xs font-mono text-zinc-600">
                LATENCY: <span className="font-bold text-zinc-900">{payload[0].value}ms</span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500"></div>
                <p className="text-xs font-mono text-zinc-600">
                TPS: <span className="font-bold text-zinc-900">{payload[1].value}</span>
                </p>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

export const LatencyTpsChart: React.FC<LatencyChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('area');

  const renderChart = () => {
    const commonProps = {
        data,
        margin: { top: 10, right: 10, left: -20, bottom: 0 }
    };

    switch(chartType) {
        case 'bar':
            return (
                <BarChart {...commonProps}>
                    <CartesianGrid strokeDasharray="0 0" vertical={false} horizontal={true} stroke="#f4f4f5" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5' }} />
                    <Bar dataKey="latency" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={8} />
                    <Bar dataKey="tps" fill="#a855f7" radius={[0, 0, 0, 0]} barSize={8} />
                </BarChart>
            );
        case 'line':
            return (
                <LineChart {...commonProps}>
                    <CartesianGrid strokeDasharray="0 0" vertical={false} horizontal={true} stroke="#f4f4f5" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e4e4e7', strokeWidth: 1 }} />
                    <Line type="step" dataKey="latency" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#1d4ed8' }} />
                    <Line type="step" dataKey="tps" stroke="#9333ea" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#7e22ce' }} />
                </LineChart>
            );
        case 'area':
        default:
            return (
                <AreaChart {...commonProps}>
                    <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.05}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.05}/>
                            <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0 0" vertical={false} horizontal={true} stroke="#f4f4f5" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e4e4e7', strokeWidth: 1 }} />
                    <Area type="step" dataKey="latency" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" activeDot={{ r: 4, fill: '#1d4ed8', strokeWidth: 0 }} />
                    <Area type="step" dataKey="tps" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#colorTps)" activeDot={{ r: 4, fill: '#7e22ce', strokeWidth: 0 }} />
                </AreaChart>
            );
    }
  };

  return (
    <div className="bg-white p-6 border border-zinc-200 h-full flex flex-col transition-all duration-300 hover:border-zinc-300">
      <div className="flex justify-between items-start mb-6">
        {/* Title Section */}
        <div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-900"></div>
                Network Performance
           </h3>
           <p className="text-[10px] uppercase tracking-wide text-zinc-400 mt-1 font-mono pl-4">Real-time RPC Latency & Throughput</p>
        </div>
        
        {/* Controls Section */}
        <div className="flex gap-2">
            {/* Chart Type Selector */}
            <div className="flex border border-zinc-200 bg-zinc-50 p-0.5">
                <button 
                    onClick={() => setChartType('area')}
                    className={`p-1.5 ${chartType === 'area' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Area Chart"
                >
                    <Activity size={14} />
                </button>
                <button 
                    onClick={() => setChartType('bar')}
                    className={`p-1.5 ${chartType === 'bar' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Bar Chart"
                >
                    <BarChart3 size={14} />
                </button>
                <button 
                    onClick={() => setChartType('line')}
                    className={`p-1.5 ${chartType === 'line' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Line Chart"
                >
                    <TrendingUp size={14} />
                </button>
            </div>

            {/* Time Selector */}
            <div className="flex border border-zinc-200 bg-zinc-50">
                {['1H', '24H', '7D'].map((opt, i) => (
                    <button key={opt} className={`px-3 py-1 text-[10px] font-bold font-mono ${i === 0 ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};