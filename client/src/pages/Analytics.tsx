import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  pending: '#c4c0ff', // primary
  completed: '#41eec2', // secondary
  cancelled: '#464555', // outline-variant
  delayed: '#ffb785' // tertiary
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-high p-4 rounded-xl shadow-2xl border-none">
        <p className="text-slate-400 font-mono text-xs mb-2 tracking-widest uppercase">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-headline font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(r => {
      setData(r.data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className='flex items-center justify-center p-20'>
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <p className="text-slate-500 font-mono text-center p-10 tracking-widest uppercase">Failed to load telemetry.</p>;

  return (
    <div className='max-w-5xl mx-auto space-y-12'>
      <div className="mb-12 border-b border-outline-variant/10 pb-8 mt-4">
        <h1 className='text-4xl md:text-5xl font-bold font-headline tracking-tighter text-[#c4c0ff] text-glow mb-2'>Analytics Hub</h1>
        <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">Insights and performance telemetry.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-8'
      >
        {/* Chart 1: Status Donut */}
        <div className='bg-surface-container-low rounded-3xl p-8 border border-outline-variant/5 transition-colors hover:border-primary/20 relative overflow-hidden group'>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
          <h2 className='font-headline text-slate-500 text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2'>
            <span className="material-symbols-outlined text-primary text-base">pie_chart</span> 
            Task Distribution
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width='100%' height="100%">
              <PieChart>
                <Pie data={data.statusBreakdown} dataKey='count' nameKey='_id' cx='50%' cy='50%' innerRadius={70} outerRadius={90} paddingAngle={4} stroke="none">
                  {data.statusBreakdown.map((e: any) => <Cell key={e._id} fill={STATUS_COLORS[e._id as keyof typeof STATUS_COLORS]}/>)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#918fa1', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly completions */}
        <div className='bg-surface-container-low rounded-3xl p-8 border border-outline-variant/5 transition-colors hover:border-primary/20 relative overflow-hidden group'>
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-secondary/10 transition-colors"></div>
          <h2 className='font-headline text-slate-500 text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2'>
             <span className="material-symbols-outlined text-secondary text-base">show_chart</span> 
             Weekly Completions
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width='100%' height="100%">
              <LineChart data={data.weeklyCompletions}>
                <XAxis dataKey='_id' stroke="#464555" tick={{ fill: '#918fa1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#464555" tick={{ fill: '#918fa1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#464555', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type='monotone' dataKey='count' name="Completed" stroke='#41eec2' strokeWidth={3} dot={{ fill: '#1b1b20', stroke: '#41eec2', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#c4c0ff', stroke: 'none' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: On-time vs late */}
        <div className='bg-surface-container-low rounded-3xl p-8 border border-outline-variant/5 transition-colors hover:border-primary/20 relative overflow-hidden group'>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
          <h2 className='font-headline text-slate-500 text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2'>
            <span className="material-symbols-outlined text-primary text-base">calendar_clock</span> 
            On-Time vs Late
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width='100%' height="100%">
              <BarChart data={[
                { name: 'On Time', count: data.onTimeVsLate.find((x:any)=>x._id)?.count||0 },
                { name: 'Late', count: data.onTimeVsLate.find((x:any)=>!x._id)?.count||0 },
              ]}>
                <XAxis dataKey='name' stroke="#464555" tick={{ fill: '#918fa1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#464555" tick={{ fill: '#918fa1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a292f' }} />
                <Bar dataKey='count' name="Tasks" fill='#c4c0ff' radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pending urgency */}
        <div className='bg-surface-container-low rounded-3xl p-8 border border-outline-variant/5 transition-colors hover:border-primary/20 relative overflow-hidden group'>
          <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary/5 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-tertiary/10 transition-colors"></div>
          <h2 className='font-headline text-slate-500 text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2'>
             <span className="material-symbols-outlined text-tertiary text-base">priority_high</span> 
             Pending by Urgency
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width='100%' height="100%">
              <BarChart data={data.pendingByUrgency.map((d: any) => ({
                  ...d,
                  name: d._id instanceof Date || (typeof d._id === 'string' && d._id !== 'later') 
                        ? new Date(d._id).toLocaleDateString() : 'Later'
              }))}>
                <XAxis dataKey='name' stroke="#464555" tick={{ fill: '#918fa1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#464555" tick={{ fill: '#918fa1', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a292f' }} />
                <Bar dataKey='count' name="Pending" fill='#ffb785' radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
