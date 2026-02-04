import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LatencyChartProps {
  data: { time: string; latency: number; tps: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-mono">{label}</p>
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500"></div>
                <p className="text-xs font-mono text-white">
                LATENCY: <span className="font-bold">{payload[0].value}ms</span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500"></div>
                <p className="text-xs font-mono text-white">
                TPS: <span className="font-bold">{payload[1].value}</span>
                </p>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

export const LatencyTpsChart: React.FC<LatencyChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 border border-zinc-200 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-900"></div>
                Network Performance
           </h3>
           <p className="text-[10px] uppercase tracking-wide text-zinc-400 mt-1 font-mono pl-4">Real-time RPC Latency & Throughput</p>
        </div>
        <div className="flex border border-zinc-200 bg-zinc-50">
            {['1H', '24H', '7D'].map((opt, i) => (
                <button key={opt} className={`px-3 py-1 text-[10px] font-bold font-mono ${i === 0 ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                    {opt}
                </button>
            ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0 0" vertical={true} horizontal={true} stroke="#f4f4f5" />
            <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={true} 
                tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
                type="step" 
                dataKey="latency" 
                stroke="#2563eb" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorLatency)" 
                activeDot={{ r: 4, fill: '#1e3a8a', strokeWidth: 0 }}
            />
             <Area 
                type="step" 
                dataKey="tps" 
                stroke="#9333ea" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorTps)" 
                activeDot={{ r: 4, fill: '#581c87', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};