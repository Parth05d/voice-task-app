import { ITask } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  task: ITask;
  onStatusChange: (id: string, status: string, due_date?: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  pending:   { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Clock },
  completed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: CheckCircle },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: XCircle },
  delayed:   { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: AlertCircle },
};

export function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
  const config = STATUS_CONFIG[task.status];
  const Icon = config.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass rounded-2xl p-5 border transition-all duration-300 hover:shadow-2xl hover:bg-surface/80
        ${isOverdue ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/5'}`}
    >
      <div className='flex justify-between items-start mb-3'>
        <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-textMuted' : 'text-textMain'}`}>
          {task.title}
        </h3>
        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.bg} ${config.text} ${config.border} border`}>
          <Icon size={14} />
          <span className="capitalize">{task.status}</span>
        </div>
      </div>

      {task.description && (
        <p className='text-sm text-textMuted mb-4 line-clamp-2'>{task.description}</p>
      )}

      {task.due_date && (
        <div className={`flex items-center gap-2 text-sm mt-3 ${isOverdue ? 'text-red-400' : 'text-textMuted'}`}>
          <Calendar size={14} />
          <span>
            {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}
          </span>
          {task.original_due_date && (
            <span className='ml-2 line-through opacity-50 text-xs'>
              (was: {format(new Date(task.original_due_date), 'MMM d')})
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      {['pending', 'delayed'].includes(task.status) && (
        <div className='flex gap-3 mt-5 pt-4 border-t border-white/5'>
          <button onClick={() => onStatusChange(task._id, 'completed')}
            className='flex-1 text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 py-2 rounded-xl transition-colors font-medium'>
            Complete
          </button>
          <button onClick={() => {
            const newDate = prompt('New due date (YYYY-MM-DD):');
            if (newDate) onStatusChange(task._id, 'delayed', newDate);
          }}
            className='flex-1 text-sm bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 py-2 rounded-xl transition-colors font-medium'>
            Delay
          </button>
          <button onClick={() => onStatusChange(task._id, 'cancelled')}
            className='flex-1 text-sm bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border border-gray-500/20 py-2 rounded-xl transition-colors font-medium'>
            Cancel
          </button>
        </div>
      )}
      
      {['completed', 'cancelled'].includes(task.status) && (
         <div className='flex justify-end mt-4'>
           <button onClick={() => onDelete(task._id)}
            className='text-xs text-red-400 hover:text-red-300 hover:underline transition-colors'>
            Delete Task
          </button>
         </div>
      )}
    </motion.div>
  );
}
