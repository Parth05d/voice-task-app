import { useState, useEffect } from 'react';
import { VoiceButton } from '../components/VoiceButton';
import { TaskCard } from '../components/TaskCard';
import { TaskConfirmModal } from '../components/TaskConfirmModal';
import { DelayModal } from '../components/DelayModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { ITask, ParsedTask } from '../types';
import api from '../api/axios';
import { AnimatePresence, motion } from 'framer-motion';

export function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [pendingParsed, setPendingParsed] = useState<{ parsed: ParsedTask; raw: string } | null>(null);
  
  const [activeDelayTask, setActiveDelayTask] = useState<ITask | null>(null);
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
    } catch (e) {
      console.error(e);
      alert('Failed to save task.');
    }
  };

  const handleStatusChange = async (id: string, status: string, due_date?: string) => {
    try {
      await api.patch(`/tasks/${id}`, { status, due_date });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<ITask>) => {
    try {
      await api.patch(`/tasks/${id}`, updates);
      fetchTasks();
      setActiveDetailTask(prev => prev ? { ...prev, ...updates } as ITask : null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className='max-w-5xl mx-auto space-y-12'>
      <div className="relative flex flex-col items-center text-center mt-8 mb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <h1 className='text-5xl md:text-7xl font-bold font-headline tracking-tighter text-[#c4c0ff] text-glow mb-4'>
          What's on your mind?
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto mb-10 text-sm md:text-base">
          Just press the mic and speak your tasks naturally. AI will extract the details, deadlines, and automatically organize them for you.
        </p>
        <VoiceButton onParsed={handleParsed} />
      </div>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-headline text-2xl font-bold flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-primary">view_list</span>
            Command Queue
            <span className="bg-surface-container-high border border-outline-variant/20 text-xs px-2 py-0.5 rounded-full ml-2 font-mono text-slate-400">
              {filteredTasks.length}
            </span>
          </h2>

          <div className='flex gap-2 mx-[-24px] px-6 sm:mx-0 sm:px-0 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide'>
            {['all','pending','completed','delayed','cancelled'].map(f => (
              <button key={f}
                onClick={() => setFilter(f as any)}
                className={`text-xs px-4 py-2 rounded-full capitalize font-headline font-bold transition-all whitespace-nowrap border
                  ${filter === f
                    ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(196,192,255,0.1)]'
                    : 'bg-surface-container-low border-outline-variant/10 text-slate-500 hover:text-white hover:border-primary/20'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredTasks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/10 flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-slate-500 mb-6 border border-outline-variant/10">
              <span className="material-symbols-outlined text-3xl">inbox</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-2">No commands found</h3>
            <p className="text-slate-500 text-sm max-w-sm">No {filter !== 'all' ? filter : ''} tasks in queue. Initialize a new command sequence via voice input.</p>
          </motion.div>
        ) : (
          <motion.div layout className='flex flex-col gap-4'>
            <AnimatePresence mode="popLayout">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onStatusChange={handleStatusChange} 
                  onDelete={handleDelete} 
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

        {activeDetailTask && (
          <TaskDetailModal
            task={activeDetailTask}
            onClose={() => setActiveDetailTask(null)}
            onUpdate={handleUpdateTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
