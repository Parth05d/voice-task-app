import { motion } from 'framer-motion';
import { ITask } from '../types';

interface Props {
  task: ITask;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

export function DeleteModal({ task, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <motion.div 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        className="bg-surface-container-high rounded-3xl p-6 md:p-8 max-w-[360px] w-full border border-error/20 shadow-[0_0_50px_rgba(255,180,171,0.1)] relative"
      >
        <h3 className="text-xl font-bold text-white font-headline mb-3 flex items-center gap-2">
           <span className="material-symbols-outlined text-error">delete_forever</span> Delete Task
        </h3>
        
        <p className="text-slate-300 text-sm mb-2">
            Are you sure you want to permanently delete this task?
        </p>
        
        <div className="bg-[#111118] border border-outline-variant/10 rounded-xl p-3 mb-8">
            <p className="text-slate-400 text-xs font-mono truncate">{task.title}</p>
        </div>

        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-slate-300 font-bold uppercase tracking-widest text-[10px] transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(task._id)} 
            className="flex-1 py-3 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">delete</span> Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
