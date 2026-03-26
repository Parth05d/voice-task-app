import { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import api from '../api/axios';
import { ParsedTask } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onParsed: (parsed: ParsedTask, raw: string) => void;
}

export function VoiceButton({ onParsed }: Props) {
  const { status, startListening, stopListening, isSupported } = useSpeechRecognition();
  const [fallbackText, setFallbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcriptDisplay, setTranscriptDisplay] = useState('');

  const handleStopRecording = async () => {
    const audioBlob = await stopListening();
    if (!audioBlob) return;
    
    setLoading(true);
    setTranscriptDisplay("Processing audio with VOX-GEN-4 neural core...");
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      
      const { data } = await api.post('/voice/parse_audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setTranscriptDisplay("");
      onParsed(data, data.text || "Voice input parsed");
    } catch (e) {
      console.error(e);
      alert('Failed to parse audio task.');
      setTranscriptDisplay("");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/voice/parse', { transcript: text });
      onParsed(data, text);
    } catch (e) {
      console.error(e);
      alert('Failed to parse text task fallback.');
    } finally {
      setLoading(false);
      setFallbackText('');
    }
  };

  return (
    <div className='flex flex-col items-center gap-8 w-full max-w-lg mx-auto my-8 relative z-10'>
      <div className="relative group perspective-1000">
        {status === 'listening' && (
           <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-20 scale-[2.5]" />
        )}
        
        <button
          onClick={status === 'listening' ? handleStopRecording : startListening}
          disabled={loading}
          className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center text-white transition-all duration-500
            ${status === 'listening'
              ? 'bg-secondary/20 shadow-[0_0_60px_rgba(65,238,194,0.4)] border border-secondary/50 scale-105'
              : 'bg-surface-container-high hover:bg-surface-container-highest border border-primary/20 hover:border-primary/50 shadow-[0_0_30px_rgba(196,192,255,0.15)] group-hover:shadow-[0_0_40px_rgba(196,192,255,0.3)]'}`}
        >
          {loading ? (
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
          ) : status === 'listening' ? (
            <div className="flex gap-1.5 items-center">
              <motion.div animate={{ height: [12, 32, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-secondary rounded-full"></motion.div>
              <motion.div animate={{ height: [12, 48, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }} className="w-1.5 bg-secondary rounded-full"></motion.div>
              <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 bg-secondary rounded-full"></motion.div>
              <motion.div animate={{ height: [12, 36, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 bg-secondary rounded-full"></motion.div>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform duration-500">mic</span>
          )}
        </button>
      </div>

      <div className="min-h-[60px] flex items-center justify-center text-center px-4 w-full">
        <AnimatePresence>
          {(status === 'listening' || transcriptDisplay) && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='text-lg font-mono tracking-wide text-white py-4 px-6 rounded-2xl w-full border border-secondary/20 bg-secondary/5 shadow-[0_0_20px_rgba(65,238,194,0.1)] backdrop-blur-md'
            >
              <span className={status === 'listening' ? 'text-secondary animate-pulse' : 'text-primary'}>
                {transcriptDisplay || "Recording audio... Speak now and press the visualizer to parse."}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className='flex gap-3 w-full max-w-md bg-surface-container-low p-2 rounded-2xl border border-outline-variant/10 focus-within:border-primary/40 focus-within:shadow-[0_0_20px_rgba(196,192,255,0.1)] transition-all'>
        <input
          value={fallbackText}
          onChange={e => setFallbackText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleTextSubmit(fallbackText)}
          placeholder={isSupported ? 'Manual command input...' : 'Microphone unsupported. Manual fallback...'}
          className='flex-1 bg-transparent px-4 py-2 text-sm font-mono text-white focus:outline-none placeholder:text-slate-600'
        />
        <button
          onClick={() => handleTextSubmit(fallbackText)}
          disabled={loading || !fallbackText.trim()}
          className='bg-surface-container-high hover:bg-primary/20 text-primary border border-outline-variant/20 hover:border-primary/40 px-6 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all disabled:opacity-50 flex items-center gap-2'
        >
          {loading && fallbackText ? <span className="material-symbols-outlined text-sm animate-spin">refresh</span> : 'Execute'}
        </button>
      </div>
    </div>
  );
}
