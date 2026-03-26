import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';
import api from '../api/axios';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  pending: '#c4c0ff', // primary
  completed: '#41eec2', // secondary
  cancelled: '#464555', // outline-variant
  delayed: '#ffb4ab' // error / critical drift
};

// Real data is processed below dynamically from the API payload.

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#181820] p-4 rounded-xl shadow-2xl border border-outline-variant/10">
        <p className="text-slate-400 font-mono text-[10px] mb-3 tracking-widest uppercase">{label}</p>
        <div className="flex flex-col gap-2">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-headline font-bold text-white flex items-center justify-between gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="capitalize">{entry.name}</span>
              </span>
              <span className="font-mono text-primary font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
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
      <div className="w-10 h-10 border-4 border-[#c4c0ff] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(196,192,255,0.5)]"></div>
    </div>
  );

  if (!data) return (
    <div className="bg-[#111118] rounded-3xl p-16 text-center border border-outline-variant/5 flex flex-col items-center mt-12 w-full max-w-7xl mx-auto mx-4">
      <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-slate-600 mb-6 border border-outline-variant/10 shadow-inner">
        <span className="material-symbols-outlined text-4xl">error</span>
      </div>
      <h3 className="font-headline text-2xl font-bold text-white mb-2 tracking-tight">Signal Lost</h3>
      <p className="text-slate-500 text-sm max-w-sm font-mono tracking-wide">Failed to sync with the primary telemetry database.</p>
    </div>
  );

  const totalTasks = data.statusBreakdown?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const completedTasks = data.statusBreakdown?.find((s: any) => s._id === 'completed')?.count || 0;
  const pendingTasks = data.statusBreakdown?.find((s: any) => s._id === 'pending')?.count || 0;

  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';

  const onTimeCount = data.onTimeVsLate?.find((s: any) => s._id === true)?.count || 0;
  const lateCount = data.onTimeVsLate?.find((s: any) => s._id === false)?.count || 0;
  const totalFinishedWithDates = onTimeCount + lateCount;
  const onTimeRate = totalFinishedWithDates > 0 ? ((onTimeCount / totalFinishedWithDates) * 100).toFixed(1) : '0.0';

  const realOnTimeVsLateData = [
    { day: 'All Time', onTime: onTimeCount, late: lateCount }
  ];

  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const weeklyTrendData = last7Days.map(date => {
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const match = data.weeklyCompletions?.find((w: any) => w._id === localDateString);
    return { day: dayLabel, value: match ? match.count : 0 };
  });

  const thisWeekTasks = data.weeklyCompletions?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

  const criticalCount = data.pendingByUrgency?.[0]?.count || 0;
  const highCount = data.pendingByUrgency?.[1]?.count || 0;
  const mediumCount = data.pendingByUrgency?.[2]?.count || 0;
  const lowCount = data.pendingByUrgency?.[3]?.count || 0;
  const maxUrgency = Math.max(criticalCount, highCount, mediumCount, lowCount, 1);

  // Custom Legends for the specific charts
  const renderDonutLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col gap-3 justify-center">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.value} ({entry.payload.percent ? (entry.payload.percent * 100).toFixed(0) : '0'}%)
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='w-full'>



      {/* Title Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-y-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-white mb-2 capitalize">
            Analytics
          </h1>
          <p className="text-secondary font-mono text-[10px] md:text-xs tracking-widest uppercase">
            OVERVIEW
          </p>
        </div>
      </div>

      {/* Top Bentos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-[#111118] border border-outline-variant/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-widest font-bold truncate">Completion Rate</span>
            <span className="material-symbols-outlined text-secondary text-sm hidden sm:block">trending_up</span>
          </div>
          <div>
            <div className="flex items-end gap-1 md:gap-2 text-white">
              <span className="text-2xl md:text-3xl font-headline font-bold">{completionRate}%</span>
            </div>
            <p className="text-[8px] md:text-[9px] text-slate-500 font-mono mt-1 w-full truncate">Of total recorded tasks.</p>
          </div>
        </div>

        <div className="bg-[#111118] border border-outline-variant/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-28 md:h-32 relative group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-widest font-bold truncate">On-Time Rate</span>
            <span className="material-symbols-outlined text-primary text-sm hidden sm:block">schedule</span>
          </div>
          <div>
            <div className="flex items-end gap-1 md:gap-2 text-white">
              <span className="text-2xl md:text-3xl font-headline font-bold">{onTimeRate}%</span>
            </div>
            <p className="text-[8px] md:text-[9px] text-slate-500 font-mono mt-1 w-full truncate">Zero delays logged.</p>
          </div>
        </div>

        <div className="bg-[#111118] border border-outline-variant/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-28 md:h-32 relative group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-widest font-bold truncate">Active Tasks</span>
            <span className="material-symbols-outlined text-[#ffb785] text-sm hidden sm:block">electric_bolt</span>
          </div>
          <div>
            <div className="flex items-end gap-1 md:gap-2 text-white">
              <span className="text-2xl md:text-3xl font-headline font-bold">{pendingTasks}</span>
            </div>
            <p className="text-[8px] md:text-[9px] text-slate-500 font-mono mt-1 w-full truncate">Currently pending.</p>
          </div>
        </div>

        <div className="bg-[#111118] border border-outline-variant/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-28 md:h-32 relative group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-widest font-bold truncate">Done This Week</span>
            <span className="material-symbols-outlined text-slate-500 text-sm hidden sm:block">check_circle</span>
          </div>
          <div>
            <div className="flex items-end gap-1 md:gap-2 text-white">
              <span className="text-2xl md:text-3xl font-headline font-bold">{thisWeekTasks}</span>
            </div>
            <p className="text-[8px] md:text-[9px] text-slate-500 font-mono mt-1 w-full truncate">Based on 7 day rolling period.</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 mt-4 w-full'
      >
        {/* Chart 1: Status Donut */}
        <div className='bg-[#111118] border border-outline-variant/10 rounded-[16px] p-6 w-full h-fit xl:h-auto overflow-visible group'>
          <div className="flex items-center justify-between mb-4">
            <h2 className='font-headline text-white text-sm font-bold'>Task Status Breakdown</h2>
            <span className="material-symbols-outlined text-slate-600 text-md">pie_chart</span>
          </div>

          <div className="h-[220px] w-full flex items-center mt-[-10px] md:mt-0 xl:mt-[-20px] relative shrink-0">
            <ResponsiveContainer width='100%' height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data.statusBreakdown?.map((item: any) => ({ ...item, name: item._id === 'pending' ? 'Pending' : item._id === 'completed' ? 'Completed' : 'On Hold' })) || []}
                  dataKey='count'
                  nameKey='name'
                  cx='40%' cy='50%'
                  innerRadius={70} outerRadius={85}
                  paddingAngle={2}
                  stroke="none"
                  cornerRadius={0}
                >
                  {data.statusBreakdown.map((e: any) => <Cell key={e._id} fill={STATUS_COLORS[e._id as keyof typeof STATUS_COLORS]} />)}
                  <Label
                    value={totalTasks}
                    position="center"
                    dy={-8}
                    className="font-headline font-bold text-3xl fill-white"
                  />
                  <Label
                    value="TOTAL"
                    position="center"
                    dy={14}
                    className="font-mono text-[8px] uppercase tracking-widest fill-slate-500"
                  />
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={renderDonutLegend} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ right: '5%', top: '50%', transform: 'translateY(-50%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Completion Trend (Line) */}
        <div className='bg-[#111118] border border-outline-variant/10 rounded-[16px] p-6 w-full h-fit xl:h-auto'>
          <div className="flex items-center justify-between mb-6">
            <h2 className='font-headline text-white text-sm font-bold'>Completion Trend</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-0.5 bg-[#c4c0ff]"></span>
              <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Velocity</span>
            </div>
          </div>

          <div className="h-[220px] w-full">
            {weeklyTrendData.length > 0 ? (
              <ResponsiveContainer width='100%' height="100%">
                <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey='day' stroke="#464555" tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} dy={10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#464555', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Line type='monotone' dataKey='value' name='Completed' stroke='#c4c0ff' strokeWidth={2} dot={true} activeDot={{ r: 4, fill: '#c4c0ff', stroke: 'none' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border border-outline-variant/5 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-slate-600 mb-2">ssid_chart</span>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Awaiting Chart Data</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: On-time vs Late */}
        <div className='bg-[#111118] border border-outline-variant/10 rounded-[16px] p-6 w-full h-fit xl:h-auto'>
          <div className="flex items-center justify-between mb-2">
            <h2 className='font-headline text-white text-sm font-bold'>On-Time vs Late</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#41eec2]"></span><span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">On Time</span></div>
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ffb785]"></span><span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Late</span></div>
            </div>
          </div>

          <div className="h-[220px] w-full items-end mt-4">
            <ResponsiveContainer width='100%' height="100%">
              {totalFinishedWithDates > 0 ? (
                <BarChart data={realOnTimeVsLateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2} barSize={40}>
                  <XAxis dataKey='day' stroke="#464555" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} tickLine={false} axisLine={false} dy={10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey='onTime' fill='#41eec2' radius={[4, 4, 0, 0]} />
                  <Bar dataKey='late' fill='#ffb785' radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border border-outline-variant/5 rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-slate-600 mb-2">bar_chart</span>
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Awaiting Date Data</p>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pending by Urgency (Custom Horizontal Bars) */}
        <div className='bg-[#111118] border border-outline-variant/10 rounded-[16px] p-6 w-full h-fit xl:h-auto flex flex-col'>
          <div className="flex items-center justify-between mb-8">
            <h2 className='font-headline text-white text-sm font-bold'>Pending by Urgency</h2>
            <span className="material-symbols-outlined text-slate-600 text-sm">priority_high</span>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {/* CRITICAL */}
            <div className="mb-4">
              <div className="flex justify-between font-mono text-[9px] font-bold mb-1.5"><span className="text-error uppercase">Next 24 Hours</span><span className="text-white">{criticalCount}</span></div>
              <div className="w-full h-1 bg-[#1b1b20] rounded-full overflow-hidden"><div className="bg-error h-full transition-all duration-1000" style={{ width: `${(criticalCount / maxUrgency) * 100}%` }}></div></div>
            </div>
            {/* HIGH */}
            <div className="mb-4">
              <div className="flex justify-between font-mono text-[9px] font-bold mb-1.5"><span className="text-[#ffb785] uppercase">Next 7 Days</span><span className="text-white">{highCount}</span></div>
              <div className="w-full h-1 bg-[#1b1b20] rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-[#ffb785] h-full transition-all duration-1000" style={{ width: `${(highCount / maxUrgency) * 100}%` }}></div>
              </div>
            </div>
            {/* MEDIUM */}
            <div className="mb-4">
              <div className="flex justify-between font-mono text-[9px] font-bold mb-1.5"><span className="text-[#c4c0ff] uppercase">Next 30 Days</span><span className="text-white">{mediumCount}</span></div>
              <div className="w-full h-1 bg-[#1b1b20] rounded-full overflow-hidden"><div className="bg-[#c4c0ff] h-full transition-all duration-1000" style={{ width: `${(mediumCount / maxUrgency) * 100}%` }}></div></div>
            </div>
            {/* LOW */}
            <div>
              <div className="flex justify-between font-mono text-[9px] font-bold mb-1.5"><span className="text-[#41eec2] uppercase">Later</span><span className="text-white">{lowCount}</span></div>
              <div className="w-full h-1 bg-[#1b1b20] rounded-full overflow-hidden"><div className="bg-[#41eec2] h-full transition-all duration-1000" style={{ width: `${(lowCount / maxUrgency) * 100}%` }}></div></div>
            </div>
          </div>
        </div>

      </motion.div>

    </div>
  );
}
