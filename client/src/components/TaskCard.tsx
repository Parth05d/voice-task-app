import { motion } from 'framer-motion';
import { ITask } from '../types';
import { format } from 'date-fns';

interface Props {
  task: ITask;
  onStatusChange: (id: string, status: string, date?: string) => void;
  onDelete: (id: string) => void;
  onDelayClick: (task: ITask) => void;
  onTaskClick: (task: ITask) => void;
}

const statusConfig: Record<string, { label: string, color: string, bg: string, border: string }> = {
  pending:   { label: 'Pending',   color: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/20' },
  completed: { label: 'Completed', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
  delayed:   { label: 'Delayed',   color: 'text-error',     bg: 'bg-error/10',     border: 'border-error/20' },
  cancelled: { label: 'Cancelled', color: 'text-slate-400', bg: 'bg-surface-container-high', border: 'border-outline-variant/20' }
};

export function TaskCard({ task, onStatusChange, onDelete, onDelayClick, onTaskClick }: Props) {
  const isOverdue = !!task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
  const config = statusConfig[task.status] || statusConfig.pending;
  const isDelayed = task.status === 'delayed' || !!task.original_due_date;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onTaskClick(task)}
      className="bg-[#111118] border border-outline-variant/10 rounded-[16px] p-6 hover:bg-surface-container-low transition-all group flex flex-col h-full cursor-pointer relative"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase ${config.bg} ${config.color} border ${config.border}`}>
          {config.label}
        </span>
        
        {/* Quick Actions Hover Menu */}
        <div className="flex gap-2">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {(task.status !== 'completed' && task.status !== 'cancelled') && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onStatusChange(task._id, 'completed'); }}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-secondary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                  </button>
                )}
                {(task.status !== 'completed' && task.status !== 'cancelled') && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelayClick(task); }}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">schedule</span>
                  </button>
                )}
                {(task.status !== 'completed' && task.status !== 'cancelled') && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onStatusChange(task._id, 'cancelled'); }}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-400 hover:bg-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">block</span>
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-error hover:bg-error/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
            <button className="text-slate-600 hover:text-on-surface group-hover:opacity-0 absolute right-6"><span className="material-symbols-outlined">more_vert</span></button>
        </div>
      </div>

      <h4 className="text-xl font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors flex-1">{task.title}</h4>
      
      {task.description ? (
          <p className="text-sm text-slate-400 font-body mb-6 line-clamp-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{task.description}</p>
      ) : (
          <p className="text-sm text-slate-500 font-body italic mb-6">No description</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5 mt-auto">
        {task.due_date ? (
          <div className={`flex items-center gap-2 ${isOverdue ? 'text-error' : isDelayed ? 'text-primary' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined text-sm">{isOverdue || isDelayed ? 'warning' : 'calendar_today'}</span>
            <span className="text-[10px] font-mono uppercase tracking-wider">{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-sm">event_busy</span>
            <span className="text-[10px] font-mono uppercase tracking-wider">No Deadline</span>
          </div>
        )}
        
        <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border border-background bg-surface-container-highest flex justify-center items-center text-[8px] font-bold text-primary">V</div>
        </div>
      </div>
    </motion.div>
  );
}
