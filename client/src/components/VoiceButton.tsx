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

  const isListening = status === 'listening';
  return (
    <div className={`border rounded-3xl p-6 md:p-10 mb-16 relative overflow-hidden group transition-all duration-500
      ${isListening ? 'bg-error/5 border-error/20' : 'bg-surface-container-low border-primary/20 hover:border-primary/40'}`}
    >
      {isListening && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-error to-transparent opacity-50 shadow-[0_0_20px_rgba(255,180,171,0.5)] animate-pulse"></div>}
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Mic & Status */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button
            onClick={isListening ? handleStopRecording : startListening}
            disabled={loading}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 relative
              ${isListening 
                ? 'bg-error/10 border border-error/30 text-error shadow-[0_0_30px_rgba(255,180,171,0.2)] mic-listening' 
                : 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:scale-105 shadow-[0_0_20px_rgba(196,192,255,0.1)]'}`}
          >
            {loading ? (
              <span className="material-symbols-outlined text-2xl md:text-3xl animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-2xl md:text-4xl" style={{fontVariationSettings: isListening ? "'FILL' 1" : "'FILL' 0"}}>{isListening ? 'mic' : 'mic_none'}</span>
            )}
          </button>
          
          <div className="flex-1 text-center md:text-left z-10 w-full md:w-auto">
            <h3 className={`font-headline font-bold text-lg md:text-xl tracking-tight mb-1 transition-colors ${isListening ? 'text-[#c4c0ff]' : 'text-white'}`}>
                {isListening ? 'LISTENING TO YOUR TASK...' : 'TAP TO RECORD TASK'}
            </h3>
            <p className="text-slate-500 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                {isListening ? 'SPEAK CLEARLY' : 'OR TYPE YOUR TASK BELOW'}
            </p>
        </div>
        </div>

        {/* Right Side: Transcript or Fallback */}
        <div className="w-full md:w-[40%]">
          <AnimatePresence mode="wait">
             {(isListening || transcriptDisplay) ? (
                 <motion.div 
                    key="listening-state"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-surface-container-highest/50 border border-outline-variant/10 rounded-xl p-4 flex items-center justify-between"
                 >
                    <span className={`font-mono text-xs md:text-sm tracking-wide line-clamp-2 leading-relaxed
                      ${isListening ? 'text-error animate-pulse' : 'text-primary'}`}>
                      {transcriptDisplay || "Listening... Speak naturally to generate tasks."}
                    </span>
                    {isListening && (
                        <div className="flex items-end gap-x-1 kinetic-wave h-8 shrink-0 ml-4 opacity-70">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-1 bg-error rounded-full" style={{animationDelay: `${i*0.1}s`}}></div>)}
                        </div>
                    )}
                 </motion.div>
             ) : (
                 <motion.div 
                    key="idle-state"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-surface-container border border-outline-variant/10 rounded-xl p-2 focus-within:border-primary/40 focus-within:bg-surface-container-high transition-all"
                 >
                    <input
                        value={fallbackText}
                        onChange={e => setFallbackText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleTextSubmit(fallbackText)}
                        placeholder={isSupported ? "Manual command override..." : "Microphone unsupported. Manual fallback..."}
                        className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm font-mono text-white focus:outline-none placeholder:text-slate-600"
                    />
                    <button
                        onClick={() => handleTextSubmit(fallbackText)}
                        disabled={loading || !fallbackText.trim()}
                        className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors disabled:opacity-30 flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-sm md:text-base">send</span>
                    </button>
                 </motion.div>
             )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
