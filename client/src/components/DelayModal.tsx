import { motion } from 'framer-motion';
import { useState } from 'react';
import { ITask } from '../types';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, startOfToday } from 'date-fns';

interface Props {
  task: ITask;
  onConfirm: (id: string, newDate: string) => void;
  onCancel: () => void;
}

export function DelayModal({ task, onConfirm, onCancel }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState('12:00');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isToday = isSameDay(day, startOfToday());
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <button
          key={day.toString()} 
          onClick={(e) => { e.stopPropagation(); setSelectedDate(cloneDay); }}
          className={`h-10 w-full flex items-center justify-center text-xs font-mono rounded-full transition-all duration-200
            ${!isCurrentMonth ? 'text-slate-600' : 'text-slate-300 hover:bg-surface-container'}
            ${isSelected ? 'bg-tertiary text-on-tertiary font-bold shadow-[0_0_15px_rgba(255,180,171,0.3)]' : ''}
            ${isToday && !isSelected ? 'border border-tertiary/50 text-tertiary' : ''}
          `}
        >
          {formattedDate}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>{days}</div>);
    days = [];
  }

  const handleConfirm = () => {
      if (!selectedDate) return;
      const [hours, mins] = time.split(':');
      const finalDate = new Date(selectedDate);
      finalDate.setHours(parseInt(hours, 10), parseInt(mins, 10));
      onConfirm(task._id, finalDate.toISOString());
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <motion.div 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        className="bg-surface-container-high rounded-3xl p-6 md:p-8 max-w-[360px] w-full border border-outline-variant/10 shadow-2xl relative"
      >
        <h3 className="text-xl font-bold text-white font-headline mb-1 flex items-center gap-2">
           <span className="material-symbols-outlined text-tertiary">update</span> Delay Task
        </h3>
        <p className="text-slate-400 text-xs mb-6 truncate">New date for "{task.title}"</p>

        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4 px-2">
           <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
           </button>
           <div className="font-headline font-bold text-slate-200 uppercase tracking-widest text-sm">
              {format(currentMonth, 'MMMM yyyy')}
           </div>
           <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
           </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
           {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
             <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
           ))}
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
           {rows}
        </div>
        
        {/* Time Selector */}
        <div className="flex items-center justify-between bg-surface-container-highest rounded-xl px-4 py-3 mb-8 border border-outline-variant/10">
           <span className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">schedule</span> Time
           </span>
           <input 
             type="time" 
             value={time}
             onChange={e => setTime(e.target.value)}
             className="bg-transparent text-white font-mono text-sm focus:outline-none focus:text-tertiary transition-colors cursor-pointer"
           />
        </div>

        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-slate-300 font-bold uppercase tracking-widest text-[10px] transition-colors">
            Cancel
          </button>
          <button 
            disabled={!selectedDate}
            onClick={handleConfirm} 
            className="flex-1 py-3 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">done</span> Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}
