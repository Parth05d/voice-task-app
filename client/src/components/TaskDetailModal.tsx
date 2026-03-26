import { motion } from 'framer-motion';
import { ITask } from '../types';
import { format } from 'date-fns';
import { useState } from 'react';

interface Props {
  task: ITask;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<ITask>) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<string, { label: string, color: string, bg: string, border: string }> = {
  pending:   { label: 'Pending',   color: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/20' },
  completed: { label: 'Completed', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
  delayed:   { label: 'Delayed',   color: 'text-error',     bg: 'bg-error/10',     border: 'border-error/20' },
  cancelled: { label: 'Cancelled', color: 'text-slate-400', bg: 'bg-surface-container-high', border: 'border-outline-variant/20' }
};

export function TaskDetailModal({ task, onClose, onUpdate, onDelete }: Props) {
  const isOverdue = !!task.due_date && new Date(task.due_date) < new Date() && task.status === 'pending';
  const config = statusConfig[task.status] || statusConfig.pending;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  
  const initialDateStr = task.due_date 
    ? new Date(new Date(task.due_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) 
    : '';
  const [editDate, setEditDate] = useState(initialDateStr);

  const handleSave = () => {
    onUpdate(task._id, { 
        title: editTitle, 
        description: editDesc,
        ...(editDate ? { due_date: new Date(editDate).toISOString() } : { due_date: undefined })
    });
    setIsEditing(false);
  };

  const handleStatusUpdate = (status: ITask['status']) => {
    onUpdate(task._id, { status });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#000000]/70 backdrop-blur-xl custom-scrollbar" onClick={onClose}>
      <motion.div 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.98, y: 10 }} 
        className="bg-surface-container-lowest rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative border border-outline-variant/20 shadow-2xl custom-scrollbar"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-50 text-slate-500 hover:text-white transition-colors bg-[#111118] p-3 rounded-full border border-outline-variant/10 shadow hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <div className="px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-28">
            
            {/* Hero Section */}
            <section className="mb-16">
                <div className="flex items-center gap-x-4 mb-8 flex-wrap gap-y-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-secondary py-1 px-3 border border-secondary/20 rounded-full bg-secondary/5 hidden sm:inline-block">Task Details</span>
                    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${config.border} ${config.color} ${config.bg}`}>{config.label}</span>
                    
                    {(task.status !== 'completed' && task.status !== 'cancelled') && (
                        <button onClick={() => setIsEditing(!isEditing)} className="font-mono text-[10px] tracking-[0.2em] uppercase bg-primary text-[#100069] font-bold py-1 px-4 rounded-full shadow-[0_0_15px_rgba(196,192,255,0.4)] hover:scale-105 transition-all flex items-center gap-1 sm:ml-auto">
                            <span className="material-symbols-outlined text-[12px]">{isEditing ? 'close' : 'edit'}</span>
                            {isEditing ? 'Cancel Edit' : 'Edit Task'}
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                  <div className="mb-10 w-full md:w-3/4">
                    <textarea 
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full bg-surface-container-high border-b-2 border-primary text-3xl md:text-5xl lg:text-6xl font-headline font-bold text-white tracking-tighter mb-4 focus:outline-none resize-none overflow-hidden rounded-t-xl p-4"
                        rows={2}
                    />
                  </div>
                ) : (
                  <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-on-surface mb-10 leading-[1.05] max-w-4xl pr-8">
                      {task.title}
                  </h1>
                )}

                {/* Simulated Visualizer */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/10 accent-glow flex flex-col md:flex-row items-center gap-6 relative overflow-hidden bg-[#181820]/40">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
                    <div className="flex-1 w-full">
                        <p className="font-headline text-lg md:text-xl font-light italic text-on-surface-variant leading-relaxed line-clamp-2">
                            "Auto-generated transcript from your voice command."
                        </p>
                        <div className="mt-4 flex items-center gap-x-3">
                            <span className="font-mono text-xs text-secondary">Confidence: 98.4%</span>
                            <div className="h-1 w-24 bg-surface-container-high rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-[98%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Detail Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 flex flex-col gap-10">
                    {/* Description Area */}
                    <div className="group relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-headline text-lg font-semibold tracking-tight flex items-center gap-x-2 text-white">
                                <span className="material-symbols-outlined text-primary text-xl">description</span>
                                Task Description
                            </h2>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="text-[#100069] text-[10px] font-mono uppercase tracking-widest bg-primary px-4 py-2 rounded hover:scale-105 transition-all font-bold">Save Changes</button>
                                </div>
                            )}
                        </div>
                        
                        {isEditing ? (
                             <textarea 
                                value={editDesc}
                                onChange={e => setEditDesc(e.target.value)}
                                rows={8}
                                placeholder="Enter a detailed description..."
                                className="w-full bg-[#111118] border border-primary/50 text-slate-300 text-sm leading-relaxed p-6 rounded-xl focus:outline-none transition-all resize-y shadow-inner"
                            />
                        ) : (
                            <div className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-outline-variant/10 transition-all min-h-[160px]">
                                <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap text-[15px]">
                                    {task.description || <span className="italic text-slate-500 text-sm">No specific description provided for this task.</span>}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Metadata Column */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Meta Bento */}
                    <div className="bg-[#181820] border border-outline-variant/10 p-8 rounded-2xl flex flex-col gap-y-6">
                        <div>
                            <label className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-2 block flex items-center gap-2">
                                Deadline
                                {isEditing && <span className="material-symbols-outlined text-xs text-primary">edit</span>}
                            </label>
                            {isEditing ? (
                                <input 
                                    type="datetime-local" 
                                    value={editDate}
                                    onChange={e => setEditDate(e.target.value)}
                                    className="w-full bg-[#111118] border border-primary/30 px-3 py-3 text-white font-mono text-xs md:text-sm focus:outline-none focus:border-primary transition-colors rounded-lg mt-1"
                                />
                            ) : (
                                <div className="flex items-center gap-x-3">
                                    <span className={`material-symbols-outlined ${isOverdue ? 'text-error' : 'text-on-surface-variant'}`}>
                                        {isOverdue ? 'warning' : 'calendar_today'}
                                    </span>
                                    <span className={`font-headline text-xl font-medium ${isOverdue ? 'text-error' : 'text-white'}`}>
                                        {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No Deadline'}
                                        {task.due_date && <span className="block text-xs font-mono text-slate-500 opacity-80 mt-1">{format(new Date(task.due_date), 'HH:mm')}</span>}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="h-px bg-outline-variant/10 w-full"></div>
                        <div>
                            <label className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-2 block">Priority</label>
                            <div className="flex items-center gap-x-3">
                                <span className={`material-symbols-outlined ${isOverdue ? 'text-error' : 'text-primary'}`} style={{fontVariationSettings: "'FILL' 1"}}>
                                    {isOverdue ? 'error' : 'bolt'}
                                </span>
                                <span className={`font-headline text-lg font-medium ${isOverdue ? 'text-error' : 'text-primary'}`}>
                                    {isOverdue ? 'High Priority' : 'Normal'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Stack */}
                    <div className="flex flex-col gap-y-4">
                        {(task.status !== 'completed' && task.status !== 'cancelled') && (
                            <button 
                                onClick={() => handleStatusUpdate('completed')}
                                className="w-full bg-gradient-to-r from-primary to-primary-container text-[#100069] font-headline font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-x-3 accent-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                Mark as Done
                            </button>
                        )}
                        <div className={`grid ${task.status === 'completed' || task.status === 'cancelled' ? 'grid-cols-1' : 'grid-cols-3'} gap-2 sm:gap-4`}>
                            {(task.status !== 'completed' && task.status !== 'cancelled') && (
                                <>
                                    <button 
                                        onClick={() => handleStatusUpdate('delayed')}
                                        className="bg-surface-container-high hover:bg-surface-variant border border-outline-variant/20 py-3 sm:py-4 px-2 sm:px-4 rounded-xl flex flex-col items-center gap-y-1 transition-all text-slate-300 hover:text-white"
                                    >
                                        <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
                                        <span className="font-headline text-xs sm:text-sm">Delay</span>
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate('cancelled')}
                                        className="bg-surface-container-high hover:bg-surface-variant border border-outline-variant/20 py-3 sm:py-4 px-2 sm:px-4 rounded-xl flex flex-col items-center gap-y-1 transition-all text-slate-300 hover:text-white"
                                    >
                                        <span className="material-symbols-outlined text-on-surface-variant">block</span>
                                        <span className="font-headline text-xs sm:text-sm">Cancel</span>
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => onDelete(task._id)}
                                className="bg-surface-container-high hover:bg-error/10 border border-outline-variant/20 py-3 sm:py-4 px-2 sm:px-4 rounded-xl flex flex-col items-center gap-y-1 transition-all group group-hover:border-error/30"
                            >
                                <span className="material-symbols-outlined text-outline group-hover:text-error transition-colors">delete</span>
                                <span className="font-headline text-xs sm:text-sm text-outline group-hover:text-error transition-colors">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>

      </motion.div>
    </div>
  );
}
