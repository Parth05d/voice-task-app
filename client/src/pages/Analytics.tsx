import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  pending: '#3B82F6', 
  completed: '#10B981',
  cancelled: '#6B7280', 
  delayed: '#F59E0B'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 border border-white/10 rounded-xl shadow-2xl">
        <p className="text-textMuted text-xs mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold text-white flex items-center gap-2">
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
    <div className='min-h-screen bg-background flex items-center justify-center p-6'>
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <p className="text-white text-center p-10">Failed to load analytics.</p>;

  return (
    <div className='min-h-[calc(100vh-64px)] bg-background p-6'>
      <div className='max-w-5xl mx-auto'>
        <div className="mb-8">
          <h1 className='text-3xl font-bold text-white tracking-tight mb-2'>Analytics Hub</h1>
          <p className="text-textMuted">Insights and performance metrics for your tasks.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
        >
          {/* Chart 1: Status Donut */}
          <div className='glass rounded-2xl p-6 border border-white/5 relative overflow-hidden'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h2 className='font-semibold text-white mb-6 flex items-center gap-2'>
              <span className="w-1 h-5 bg-primary rounded-full"></span> 
              Task Distribution
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width='100%' height="100%">
                <PieChart>
                  <Pie data={data.statusBreakdown} dataKey='count' nameKey='_id' cx='50%' cy='50%' innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {data.statusBreakdown.map((e: any) => <Cell key={e._id} fill={STATUS_COLORS[e._id as keyof typeof STATUS_COLORS]}/>)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Weekly completions */}
          <div className='glass rounded-2xl p-6 border border-white/5 relative overflow-hidden'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h2 className='font-semibold text-white mb-6 flex items-center gap-2'>
               <span className="w-1 h-5 bg-green-500 rounded-full"></span> 
               Weekly Completions
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width='100%' height="100%">
                <LineChart data={data.weeklyCompletions}>
                  <XAxis dataKey='_id' stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type='monotone' dataKey='count' name="Completed" stroke='#10B981' strokeWidth={3} dot={{ fill: '#09090b', stroke: '#10B981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: On-time vs late */}
          <div className='glass rounded-2xl p-6 border border-white/5 relative overflow-hidden text-white'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h2 className='font-semibold mb-6 flex items-center gap-2'>
              <span className="w-1 h-5 bg-blue-500 rounded-full"></span> 
              On-Time vs Late
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width='100%' height="100%">
                <BarChart data={[
                  { name: 'On Time', count: data.onTimeVsLate.find((x:any)=>x._id)?.count||0 },
                  { name: 'Late', count: data.onTimeVsLate.find((x:any)=>!x._id)?.count||0 },
                ]}>
                  <XAxis dataKey='name' stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey='count' name="Tasks" fill='#3B82F6' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Pending urgency */}
          <div className='glass rounded-2xl p-6 border border-white/5 relative overflow-hidden'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <h2 className='font-semibold text-white mb-6 flex items-center gap-2'>
               <span className="w-1 h-5 bg-orange-500 rounded-full"></span> 
               Pending by Urgency
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width='100%' height="100%">
                <BarChart data={data.pendingByUrgency.map((d: any) => ({
                    ...d,
                    name: d._id instanceof Date || (typeof d._id === 'string' && d._id !== 'later') 
                          ? new Date(d._id).toLocaleDateString() : 'Later'
                }))}>
                  <XAxis dataKey='name' stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey='count' name="Pending" fill='#F59E0B' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
