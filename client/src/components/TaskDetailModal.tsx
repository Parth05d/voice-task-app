import { motion } from 'framer-motion';
import { ITask } from '../types';
import { format } from 'date-fns';
import { useState } from 'react';

interface Props {
  task: ITask;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ITask>) => void;
}

const STATUS_CONFIG = {
  pending:   { bg: 'bg-primary-container text-primary', icon: 'schedule' },
  completed: { bg: 'bg-on-secondary-container text-secondary', icon: 'check_circle' },
  cancelled: { bg: 'bg-surface-container-high text-slate-400', icon: 'cancel' },
  delayed:   { bg: 'bg-tertiary-container/20 text-tertiary', icon: 'warning' },
};

export function TaskDetailModal({ task, onClose, onUpdate }: Props) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
  const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  
  // Initialize the date string in YYYY-MM-DDTHH:mm format for the input
  const initialDateStr = task.due_date 
    ? new Date(new Date(task.due_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) 
    : '';
  const [editDate, setEditDate] = useState(initialDateStr);

  const handleSave = () => {
    onUpdate(task._id, { 
        title: editTitle, 
        description: editDesc,
        ...(editDate && { due_date: new Date(editDate).toISOString() })
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 20 }} 
        className="bg-surface-container-low rounded-3xl p-8 max-w-lg w-full border border-outline-variant/10 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-surface-container hover:bg-surface-container-high p-2 rounded-full border border-outline-variant/5">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <div className="flex justify-between items-center mb-6 pr-12">
            <div className={`inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full ${config.bg}`}>
            <span className="material-symbols-outlined text-sm">{config.icon}</span>
            {task.status}
            </div>
            
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-xs">edit</span> Edit
                </button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={handleSave} className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-white flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-xs">save</span> Save
                    </button>
                </div>
            )}
        </div>

        {isEditing ? (
            <input 
                type="text" 
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="w-full bg-surface-container-highest border-b-2 border-primary/50 text-3xl font-bold text-white font-headline tracking-tighter mb-4 focus:outline-none focus:border-primary transition-all px-2 py-1 rounded-t-md"
            />
        ) : (
            <h2 className="text-3xl font-bold text-white font-headline tracking-tighter mb-4 pr-8">{task.title}</h2>
        )}
        
        {isEditing ? (
            <textarea 
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={4}
                placeholder="Enter a description..."
                className="w-full bg-surface-container-highest/50 border border-outline-variant/20 focus:border-primary text-slate-300 text-sm leading-relaxed p-4 rounded-2xl mb-6 focus:outline-none transition-all resize-none"
            />
        ) : (task.description || isEditing) ? (
          <div className="bg-surface-container-highest/50 rounded-2xl p-4 mb-6 border border-outline-variant/5">
            <h4 className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-2 font-headline">Description</h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-highest/30 rounded-2xl p-4 border border-outline-variant/5">
            <h4 className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-1 font-headline">Created On</h4>
            <p className="text-white font-mono text-xs">{format(new Date(task.created_at || Date.now()), 'MMM do, yyyy')}</p>
          </div>
          
          <div className={`bg-surface-container-highest/30 rounded-2xl p-4 border ${isOverdue ? 'border-error/20 bg-error/5' : 'border-outline-variant/5'}`}>
            <h4 className="text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-1 font-headline flex items-center gap-1">
              Due Date
              {isEditing && <span className="material-symbols-outlined text-[10px] text-primary">edit</span>}
            </h4>
            
            {isEditing ? (
              <input 
                type="datetime-local" 
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                className="w-full bg-surface-container border-b border-primary/30 px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-primary transition-colors rounded-t mt-1"
              />
            ) : task.due_date ? (
              <>
                <div className={`font-mono text-xs ${isOverdue ? 'text-error' : 'text-primary'}`}>
                  {format(new Date(task.due_date), 'MMM dd, yyyy')}
                  <br/>
                  <span className="text-[10px] opacity-70 mt-0.5 inline-block">{format(new Date(task.due_date), 'HH:mm')}</span>
                </div>
                {task.original_due_date && (
                  <p className="text-[10px] text-slate-500 mt-2 line-through font-mono">
                    was {format(new Date(task.original_due_date), 'MMM dd')}
                  </p>
                )}
              </>
            ) : (
                <p className="text-slate-500 text-xs italic font-mono mt-1">No due date set</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
