import { ITask } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Props {
  task: ITask;
  onStatusChange: (id: string, status: string, due_date?: string) => void;
  onDelete: (id: string) => void;
  onDelayClick?: (task: ITask) => void;
  onTaskClick?: (task: ITask) => void;
}

const STATUS_CONFIG = {
  pending:   { bg: 'bg-primary-container text-primary', icon: 'schedule' },
  completed: { bg: 'bg-on-secondary-container text-secondary', icon: 'check_circle' },
  cancelled: { bg: 'bg-surface-container-high text-slate-400', icon: 'cancel' },
  delayed:   { bg: 'bg-tertiary-container/20 text-tertiary', icon: 'warning' },
};

export function TaskCard({ task, onStatusChange, onDelete, onDelayClick, onTaskClick }: Props) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
  const config = STATUS_CONFIG[task.status];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onTaskClick?.(task)}
      className={`bg-surface-container-low rounded-3xl p-6 transition-all duration-300 hover:bg-surface-container-highest border group ${onTaskClick ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${isOverdue ? 'border-error/20 shadow-[0_0_15px_rgba(255,180,171,0.05)]' : 'border-outline-variant/10 hover:border-primary/20'}`}
    >
      <div className='flex justify-between items-start mb-4'>
        <h3 className={`font-headline font-bold text-lg md:text-xl pr-4 ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
          {task.title}
        </h3>
        <div className={`flex items-center gap-1 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full ${config.bg}`}>
          <span className="material-symbols-outlined text-sm">{config.icon}</span>
          {task.status}
        </div>
      </div>

      {task.description && (
        <p className='text-sm text-slate-400 mb-6 leading-relaxed'>{task.description}</p>
      )}

      {task.due_date && (
        <div className={`flex items-center gap-2 text-xs font-mono tracking-wider mt-4 ${isOverdue ? 'text-error' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined text-sm">event</span>
          <span>
            {format(new Date(task.due_date), 'MMM dd, yyyy - HH:mm')}
          </span>
          {task.original_due_date && (
            <span className='ml-2 line-through opacity-50 text-[10px]'>
              (was: {format(new Date(task.original_due_date), 'MMM dd')})
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      {['pending', 'delayed'].includes(task.status) && (
        <div className='flex gap-4 mt-6 pt-6 border-t border-outline-variant/10'>
          <button onClick={(e) => { e.stopPropagation(); onStatusChange(task._id, 'completed'); }}
            className='flex-1 flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-black text-secondary hover:text-white transition-colors bg-secondary/10 hover:bg-secondary/20 py-3 rounded-xl'>
            <span className="material-symbols-outlined text-base">task_alt</span> Complete
          </button>
          <button onClick={(e) => { 
            e.stopPropagation(); 
            if (onDelayClick) {
              onDelayClick(task);
            } else {
              const newDate = prompt('New due date (YYYY-MM-DD):');
              if (newDate) onStatusChange(task._id, 'delayed', newDate);
            }
          }}
            className='flex-1 flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-black text-tertiary hover:text-white transition-colors border border-outline-variant/20 hover:bg-surface-container py-3 rounded-xl'>
            <span className="material-symbols-outlined text-base">update</span> Delay
          </button>
          <button onClick={(e) => { e.stopPropagation(); onStatusChange(task._id, 'cancelled'); }}
            className='flex-1 flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-black text-slate-500 hover:text-white transition-colors hover:bg-surface-container-high py-3 rounded-xl'>
            <span className="material-symbols-outlined text-base">close</span> Cancel
          </button>
        </div>
      )}
      
      {['completed', 'cancelled'].includes(task.status) && (
         <div className='flex justify-end mt-4'>
           <button onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
            className='text-[10px] font-headline font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 text-error hover:text-error-container transition-all'>
            Delete Record
          </button>
         </div>
      )}
    </motion.div>
  );
}
