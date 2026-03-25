import { useState, useEffect } from 'react';
import { VoiceButton } from '../components/VoiceButton';
import { TaskCard } from '../components/TaskCard';
import { TaskConfirmModal } from '../components/TaskConfirmModal';
import { ITask, ParsedTask } from '../types';
import api from '../api/axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList, LayoutList } from 'lucide-react';

export function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [pendingParsed, setPendingParsed] = useState<{ parsed: ParsedTask; raw: string } | null>(null);
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
    <div className='min-h-[calc(100vh-64px)] bg-background p-6'>
      <div className='max-w-3xl mx-auto'>
        
        <div className="mb-10 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          <h1 className='text-3xl font-bold font-sans text-white mb-3'>What's on your mind?</h1>
          <p className="text-textMuted max-w-lg mx-auto">Just press the mic and speak your tasks naturally. AI will extract the details, deadlines, and automatically organize them for you.</p>
          <div className="mt-8">
            <VoiceButton onParsed={handleParsed} />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <LayoutList className="text-primary" />
            <h2>Your Tasks</h2>
            <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full ml-2">{filteredTasks.length}</span>
          </div>

          <div className='flex gap-2 mx-[-24px] px-6 sm:mx-0 sm:px-0 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide'>
            {['all','pending','completed','delayed','cancelled'].map(f => (
              <button key={f}
                onClick={() => setFilter(f as any)}
                className={`text-xs px-4 py-2 rounded-full capitalize font-medium transition-all whitespace-nowrap
                  ${filter === f
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-surface border border-white/5 text-textMuted hover:text-white hover:bg-white/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredTasks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-12 text-center border-dashed border-2 border-white/10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-4 shadow-inner">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
            <p className="text-textMuted text-sm max-w-sm">You don't have any {filter !== 'all' ? filter : ''} tasks right now. Try creating one using the voice input above.</p>
          </motion.div>
        ) : (
          <motion.div layout className='flex flex-col gap-4'>
            <AnimatePresence>
              {filteredTasks.map(task => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {pendingParsed && (
        <TaskConfirmModal
          parsed={pendingParsed.parsed}
          rawTranscript={pendingParsed.raw}
          onConfirm={handleConfirm}
          onCancel={() => setPendingParsed(null)}
        />
      )}
    </div>
  );
}
