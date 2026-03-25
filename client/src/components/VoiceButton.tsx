import { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import api from '../api/axios';
import { ParsedTask } from '../types';
import { Mic, Square, Loader2 } from 'lucide-react';
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
    setTranscriptDisplay("Processing audio with Groq Whisper...");
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
    <div className='flex flex-col items-center gap-6 w-full max-w-md mx-auto my-8'>
      <div className="relative">
        {status === 'listening' && (
           <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30 scale-150" />
        )}
        
        <button
          onClick={status === 'listening' ? handleStopRecording : startListening}
          disabled={loading}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300
            ${status === 'listening'
              ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
              : 'bg-primary hover:bg-primaryAccent'}`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-8 h-8" />
          ) : status === 'listening' ? (
            <Square className="w-8 h-8" fill="currentColor" />
          ) : (
            <Mic className="w-10 h-10" />
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
              className='text-xl font-light text-textMain glass py-3 px-6 rounded-2xl w-full border border-primary/20 bg-primary/5'
            >
              <span className={status === 'listening' ? 'animate-pulse text-red-400 font-medium' : 'text-primaryAccent'}>
                {transcriptDisplay || "Recording audio... Speak now and press stop to parse."}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className='flex gap-2 w-full'>
        <input
          value={fallbackText}
          onChange={e => setFallbackText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleTextSubmit(fallbackText)}
          placeholder={isSupported ? 'Or type your task here...' : 'Microphone unsupported. Type here...'}
          className='flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none'
        />
        <button
          onClick={() => handleTextSubmit(fallbackText)}
          disabled={loading || !fallbackText.trim()}
          className='bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-6 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50'
        >
          {loading && fallbackText ? <Loader2 className="animate-spin" size={16}/> : 'Parse'}
        </button>
      </div>
    </div>
  );
}
