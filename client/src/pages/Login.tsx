import { useState } from 'react';
import { supabase } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e13] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,192,255,0.08)_0,transparent_100%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface-container-low rounded-[2rem] p-10 relative z-10 border border-outline-variant/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 accent-glow">
            <span className="material-symbols-outlined text-3xl">keyboard_voice</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold font-headline text-center text-white mb-3">
          {isSignUp ? 'System Registration' : 'Authentication'}
        </h2>
        <p className="text-slate-400 font-mono tracking-widest text-[10px] uppercase text-center mb-10">
          Neural Task Management <span className="text-primary">•</span> VOX AI
        </p>

        {error && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error/20 rounded-xl text-error text-xs font-mono tracking-widest text-center uppercase">
            [ERR] {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Identification (Email)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 px-0 py-3 text-white font-mono focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder-slate-600 rounded-t-md"
              required
            />
          </div>
          <div className="group">
            <label className="block text-[10px] font-headline font-bold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Passcode</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest border-b-2 border-outline-variant/20 hover:border-primary/50 px-0 py-3 text-white font-mono focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder-slate-600 rounded-t-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-[#1b0091] font-black uppercase tracking-widest text-sm py-4 mt-4 rounded-xl accent-glow hover:to-primary transition-all flex justify-center items-center gap-2"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-base">refresh</span> : (isSignUp ? 'Initialize Profile' : 'Access System')}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-8 text-xs font-headline font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          {isSignUp ? 'Back to Login Portal' : 'Request Access Rights'}
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </motion.div>
    </div>
  );
}
