import { useState, useEffect } from 'react';
import { VoiceButton } from '../components/VoiceButton';
import { TaskCard } from '../components/TaskCard';
import { TaskConfirmModal } from '../components/TaskConfirmModal';
import { DelayModal } from '../components/DelayModal';
import { DeleteModal } from '../components/DeleteModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { ITask, ParsedTask } from '../types';
import api from '../api/axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export function Home() {
  const { session } = useAuth();
  const userName = session?.user?.user_metadata?.first_name || session?.user?.email?.split('@')[0] || 'User';

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [pendingParsed, setPendingParsed] = useState<{ parsed: ParsedTask; raw: string } | null>(null);
  
  const [activeDelayTask, setActiveDelayTask] = useState<ITask | null>(null);
  const [activeDeleteTask, setActiveDeleteTask] = useState<ITask | null>(null);
  const [activeDetailTask, setActiveDetailTask] = useState<ITask | null>(null);

  const [filter, setFilter] = useState<'all'|'pending'|'completed'|'delayed'|'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleParsed = (parsed: ParsedTask, raw: string) => {
    setPendingParsed({ parsed, raw });
  };

  const handleConfirm = async (task: Partial<ParsedTask>) => {
    try {
      await api.post('/tasks', task);
      setPendingParsed(null);
      fetchTasks();
      window.dispatchEvent(new CustomEvent('notifications_updated'));
    } catch (e) {
      console.error(e);
      alert('Failed to save task.');
    }
  };

  const handleStatusChange = async (id: string, status: string, due_date?: string) => {
    try {
      await api.patch(`/tasks/${id}`, { status, due_date });
      fetchTasks();
      window.dispatchEvent(new CustomEvent('notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<ITask>) => {
    try {
      await api.patch(`/tasks/${id}`, updates);
      fetchTasks();
      setActiveDetailTask(prev => prev ? { ...prev, ...updates } as ITask : null);
      window.dispatchEvent(new CustomEvent('notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      setActiveDeleteTask(null);
      window.dispatchEvent(new CustomEvent('notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  // Stats derived from tasks array
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const delayedCount = tasks.filter(t => t.status === 'delayed' || (t.due_date && new Date(t.due_date) < new Date() && t.status === 'pending')).length;

  return (
    <div className='w-full'>
      
      {/* Dynamic Date & Title Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-y-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-on-surface mb-2 capitalize">
            {(() => {
              const hr = new Date().getHours();
              if (hr >= 5 && hr < 12) return 'Good morning';
              if (hr >= 12 && hr < 17) return 'Good afternoon';
              return 'Good evening';
            })()}, {userName}.
          </h1>
          <p className="text-slate-400 font-mono text-xs md:text-sm tracking-widest uppercase">
            {format(new Date(), 'MMM dd, yyyy • hh:mm a')}
          </p>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
        <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl border-l-2 border-[#c4c0ff] flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between mb-2 md:mb-4 text-slate-400">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest">Total Tasks</span>
            <span className="material-symbols-outlined text-xs md:text-sm hidden sm:block">assignment</span>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-white">{totalCount}</p>
        </div>

        <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl border-l-2 border-secondary flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between mb-2 md:mb-4 text-slate-400">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-secondary">Completed</span>
            <span className="material-symbols-outlined text-xs md:text-sm text-secondary hidden sm:block">task_alt</span>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-white">{completedCount}</p>
        </div>

        <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl border-l-2 border-primary-container flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between mb-2 md:mb-4 text-slate-400">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-[#8781ff]">Pending</span>
            <span className="material-symbols-outlined text-xs md:text-sm text-[#8781ff] hidden sm:block">pending_actions</span>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-white">{pendingCount}</p>
        </div>

        <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl border-l-2 border-error flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between mb-2 md:mb-4 text-slate-400">
            <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-error">Overdue</span>
            <span className="material-symbols-outlined text-xs md:text-sm text-error hidden sm:block">warning</span>
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-white">{delayedCount}</p>
        </div>
      </div>

      {/* Command Initialization (Voice) */}
      <VoiceButton onParsed={handleParsed} />

      {/* Active Archive (Tasks) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-headline text-2xl font-bold flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-primary">view_list</span>
            Your Tasks
            <span className="bg-surface-container-high border border-outline-variant/20 text-[10px] font-mono px-3 py-1 rounded-full ml-2 text-slate-400">
              {filteredTasks.length} TASKS
            </span>
          </h2>

          <div className='flex gap-2 mx-[-16px] px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide'>
            {['all','pending','completed','delayed','cancelled'].map(f => (
              <button key={f}
                onClick={() => setFilter(f as any)}
                className={`text-xs px-5 py-2.5 rounded-full capitalize font-headline font-bold transition-all whitespace-nowrap border
                  ${filter === f
                    ? 'bg-primary/20 text-[#c4c0ff] border-primary/40 shadow-[0_0_15px_rgba(196,192,255,0.15)]'
                    : 'bg-surface-container-low border-transparent text-slate-500 hover:text-white hover:bg-surface-container-high'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-[#c4c0ff] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(196,192,255,0.5)]"></div></div>
        ) : filteredTasks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111118] rounded-3xl p-16 text-center border border-outline-variant/5 flex flex-col items-center">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-slate-600 mb-6 border border-outline-variant/10 shadow-inner">
              <span className="material-symbols-outlined text-4xl">inbox</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-white mb-2 tracking-tight">Nothing Here</h3>
            <p className="text-slate-500 text-sm max-w-sm font-mono tracking-wide">No {filter !== 'all' ? filter : ''} tasks found.</p>
          </motion.div>
        ) : (
          <motion.div layout className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            <AnimatePresence mode="popLayout">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                  onDelete={() => setActiveDeleteTask(task)} 
                  onDelayClick={setActiveDelayTask}
                  onTaskClick={setActiveDetailTask}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {pendingParsed && (
          <TaskConfirmModal
            parsed={pendingParsed.parsed}
            rawTranscript={pendingParsed.raw}
            onConfirm={handleConfirm}
            onCancel={() => setPendingParsed(null)}
          />
        )}
        
        {activeDelayTask && (
          <DelayModal
            task={activeDelayTask}
            onCancel={() => setActiveDelayTask(null)}
            onConfirm={(id, newDate) => {
              handleStatusChange(id, 'delayed', newDate);
              setActiveDelayTask(null);
            }}
          />
        )}

        {activeDeleteTask && (
          <DeleteModal
            task={activeDeleteTask}
            onCancel={() => setActiveDeleteTask(null)}
            onConfirm={handleDelete}
          />
        )}

        {activeDetailTask && (
          <TaskDetailModal
            task={activeDetailTask}
            onClose={() => setActiveDetailTask(null)}
            onUpdate={handleUpdateTask}
            onDelete={() => {
              setActiveDetailTask(null);
              setActiveDeleteTask(activeDetailTask);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
