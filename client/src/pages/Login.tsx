import { useState } from 'react';
import { supabase } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#0b0b0f] font-body text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,192,255,0.03)_0,transparent_100%)] pointer-events-none" />

      {/* Hero / Brand Section */}
      <div className="w-full lg:w-[45%] p-8 sm:p-12 lg:p-16 flex flex-col relative z-10 min-h-[50vh] lg:min-h-screen justify-between border-b lg:border-b-0 lg:border-r border-outline-variant/10">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-20">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-[#c4c0ff] flex items-center justify-center border border-primary/20 accent-glow">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>voice_selection</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-[#c4c0ff] font-headline">VOX</span>
        </div>

        {/* Hero Copy */}
        <div className="mt-16 lg:mt-0 relative z-20 xl:pl-8">
            <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] xl:text-[5.5rem] font-bold font-headline leading-[1.05] tracking-tight text-white mb-12">
                Your voice.<br />
                Your tasks.<br />
                <span className="text-[#c4c0ff] opacity-90">Done.</span>
            </h1>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 bg-[#181820]/80 backdrop-blur border border-outline-variant/10 px-4 py-2 rounded-full shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-xs font-headline font-semibold text-slate-300">Voice-first</span>
                </div>
                <div className="flex items-center gap-2 bg-[#181820]/80 backdrop-blur border border-outline-variant/10 px-4 py-2 rounded-full shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-headline font-semibold text-slate-300">AI-powered</span>
                </div>
                <div className="flex items-center gap-2 bg-[#181820]/80 backdrop-blur border border-outline-variant/10 px-4 py-2 rounded-full shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#8781ff]"></span>
                    <span className="text-xs font-headline font-semibold text-slate-300">Instant</span>
                </div>
            </div>
        </div>
        
        <div className="hidden lg:block"></div> {/* Spacer for flex-between */}
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative z-20 bg-[#0e0e13]">
        <div className="w-full max-w-md">
            
            {/* Toggle AppAuth */}
            <div className="flex bg-[#181820] p-1.5 rounded-xl mb-12 border border-outline-variant/10 shadow-inner max-w-[280px]">
                <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-headline font-semibold transition-all ${!isSignUp ? 'bg-[#2a2933] text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Log In
                </button>
                <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-headline font-semibold transition-all ${isSignUp ? 'bg-[#2a2933] text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Sign Up
                </button>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-white mb-2 tracking-tight">
                    {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <p className="text-sm text-slate-400 font-mono tracking-tight">
                    {isSignUp ? 'Sign up to get started with your tasks.' : 'Log in to access your workspace.'}
                </p>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-6 p-4 bg-error-container/20 border border-error/20 rounded-xl text-error text-xs font-mono tracking-widest text-center uppercase">
                        [ERR] {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-[#181820] border border-outline-variant/10 hover:border-primary/30 px-5 py-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder-slate-500 rounded-xl font-headline"
                        required
                    />
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-[#181820] border border-outline-variant/10 hover:border-primary/30 px-5 py-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder-slate-500 rounded-xl font-headline pr-12"
                        required
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#c4c0ff] transition-colors flex items-center justify-center p-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#9f96ff] hover:bg-[#b5aeff] active:bg-[#857cff] text-[#1b0091] font-headline font-bold text-sm sm:text-base py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(159,150,255,0.2)] hover:shadow-[0_0_30px_rgba(159,150,255,0.4)] flex justify-center items-center gap-2"
                >
                    {loading ? <span className="material-symbols-outlined animate-spin text-xl">refresh</span> : 'CONTINUE'}
                </button>
            </form>

            <div className="mt-12 lg:mt-24 text-center">
                <p className="text-xs text-slate-500 font-mono tracking-wide">
                    No credit card required. <span className="text-secondary font-semibold">Free forever.</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

