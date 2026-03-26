import { useState } from 'react';
import { ParsedTask } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  parsed: ParsedTask;
  rawTranscript: string;
  onConfirm: (task: Partial<ParsedTask>) => void;
  onCancel: () => void;
}

export function TaskConfirmModal({ parsed, rawTranscript, onConfirm, onCancel }: Props) {
  const [title, setTitle] = useState(parsed.title);
  const [description, setDescription] = useState(parsed.description);
  const [dueDate, setDueDate] = useState(parsed.due_date || '');

  const confidenceColor = {
    high: 'text-secondary bg-on-secondary-container',
    medium: 'text-tertiary bg-tertiary-container/30',
    low: 'text-error bg-error-container/30',
  }[parsed.confidence];

  return (
    <AnimatePresence>
      <div className='fixed inset-0 bg-[#0e0e13]/80 backdrop-blur-md flex items-center justify-center z-[100] p-4'>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className='bg-surface-variant/90 border border-outline-variant/20 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_40px_rgba(196,192,255,0.1)] relative overflow-hidden'
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <h2 className='text-3xl font-bold font-headline text-white mb-2 flex items-center gap-3'>
            <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
            Data Extraction
          </h2>

          <div className="bg-surface-container-low rounded-xl p-4 mb-6 border-l-2 border-primary/50 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-2 text-[10px] text-slate-500 font-mono tracking-widest uppercase opacity-50">RAW AUDIO TRANSCRIPT</div>
            <p className='text-sm text-slate-300 font-mono leading-relaxed relative z-10'>"{rawTranscript}"</p>
          </div>

          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-outline-variant/10">
            <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase flex items-center gap-1.5 ${confidenceColor}`}>
              <span className="material-symbols-outlined text-sm">verified</span>
              Confidence: {parsed.confidence}
            </span>
          </div>

          {parsed.warnings.length > 0 && (
            <div className='mb-6 p-4 bg-error-container/20 border border-error/20 rounded-2xl text-sm text-error flex items-start gap-3'>
              <span className="material-symbols-outlined shrink-0 text-xl">warning</span>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                {parsed.warnings.map((w, i) => <span key={i}>{w}</span>)}
              </div>
            </div>
          )}

          <div className='space-y-6'>
            <div className="group">
              <label className='flex items-center gap-2 text-xs font-bold font-headline uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors'>
                <span className="material-symbols-outlined text-sm">title</span> Command Title
              </label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                className='w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 text-xl font-headline text-white focus:border-primary focus:outline-none transition-all px-0 py-2 placeholder-slate-600 rounded-t-md' />
            </div>
            
            <div className="group">
              <label className='flex items-center gap-2 text-xs font-bold font-headline uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors'>
                <span className="material-symbols-outlined text-sm">description</span> Brief
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className='w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 text-sm font-body text-slate-300 focus:border-primary focus:outline-none transition-all px-0 py-2 resize-none rounded-t-md' rows={2} />
            </div>

            <div className="group">
              <label className='flex items-center gap-2 text-xs font-bold font-headline uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors'>
                <span className="material-symbols-outlined text-sm">event</span> Deadline
              </label>
              <input type='datetime-local' value={dueDate ? dueDate.slice(0, 16) : ''}
                onChange={e => setDueDate(e.target.value)}
                className='w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 text-sm font-mono tracking-widest text-white focus:border-primary focus:outline-none transition-all px-0 py-2 rounded-t-md [color-scheme:dark]' />
            </div>
          </div>

          <div className='flex gap-4 mt-10'>
            <button onClick={onCancel}
              className='flex-1 border border-outline-variant/20 hover:bg-surface-container-high rounded-xl py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors'>
              Abort
            </button>
            <button
              onClick={() => onConfirm({ title, description, due_date: dueDate || null })}
              disabled={!title.trim()}
              className='flex-[2] bg-gradient-to-br from-primary to-primary-container hover:to-primary text-[#1b0091] accent-glow rounded-xl py-4 text-xs font-black uppercase tracking-widest disabled:opacity-50 disabled:shadow-none transition-all'>
              Commit Task
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
