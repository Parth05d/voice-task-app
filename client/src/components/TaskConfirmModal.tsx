import { useState } from 'react';
import { ParsedTask } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Calendar, FileText, Check } from 'lucide-react';

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
    high: 'text-green-400 bg-green-500/10 border-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-red-400 bg-red-500/10 border-red-500/20',
  }[parsed.confidence];

  return (
    <AnimatePresence>
      <div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className='glass border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden'
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primaryAccent to-primary opacity-50"></div>
          
          <h2 className='text-xl font-bold text-white mb-2'>Review AI Extraction</h2>

          <div className="bg-surface/50 rounded-lg p-3 mb-5 border border-white/5">
            <p className='text-sm text-textMuted italic leading-relaxed'>"{rawTranscript}"</p>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${confidenceColor} flex items-center gap-1.5`}>
              <Check size={12} /> AI Confidence: <span className="uppercase">{parsed.confidence}</span>
            </span>
          </div>

          {parsed.warnings.length > 0 && (
            <div className='mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300 flex items-start gap-2'>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                {parsed.warnings.map((w, i) => <span key={i}>{w}</span>)}
              </div>
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-textMuted mb-1.5'>
                <FileText size={14} /> Task Title *
              </label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                className='w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all' />
            </div>
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-textMuted mb-1.5'>
                <FileText size={14} /> Description
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className='w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none' rows={3} />
            </div>
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-textMuted mb-1.5'>
                <Calendar size={14} /> Due Date
              </label>
              <input type='datetime-local' value={dueDate ? dueDate.slice(0, 16) : ''}
                onChange={e => setDueDate(e.target.value)}
                className='w-full bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all [color-scheme:dark]' />
            </div>
          </div>

          <div className='flex gap-3 mt-8'>
            <button onClick={onCancel}
              className='flex-1 border border-white/10 hover:bg-white/5 rounded-xl py-2.5 text-sm font-medium text-textMuted transition-colors'>
              Cancel
            </button>
            <button
              onClick={() => onConfirm({ title, description, due_date: dueDate || null })}
              disabled={!title.trim()}
              className='flex-1 bg-primary hover:bg-primaryAccent text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-xl py-2.5 text-sm font-medium disabled:opacity-50 disabled:shadow-none transition-all'>
              Save Task
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
