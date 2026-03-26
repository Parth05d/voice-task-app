import { Link, useLocation } from 'react-router-dom';
import { useAuth, supabase } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { session } = useAuth();
  
  const handleSignOut = async () => {
      await supabase.auth.signOut();
  };
  
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      if (session) {
        api.get('/notifications/unread-count')
          .then(res => setUnreadCount(res.data.count))
          .catch(console.error);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    
    const handleUpdate = (e: any) => {
      if (e.detail?.action === 'decrease') {
         setUnreadCount(prev => Math.max(0, prev - 1));
      } else if (e.detail?.action === 'clear') {
         setUnreadCount(0);
      } else {
         fetchUnread();
      }
    };
    
    window.addEventListener('notifications_updated', handleUpdate);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('notifications_updated', handleUpdate);
    };
  }, [session, pathname]);

  return (
    <div className="bg-background text-on-background font-body min-h-screen max-w-[100vw] overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 lg:px-8 h-20 bg-[#0e0e13]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-black tracking-tighter text-[#c4c0ff] flex items-center gap-2 font-headline">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>voice_selection</span>
            VOX
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-outline-variant/20 bg-surface-container-high flex items-center justify-center shrink-0">
            {session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture ? (
               <img src={session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
               <span className="text-primary font-bold uppercase text-xs md:text-sm">
                 {session?.user?.email?.charAt(0) || 'U'}
               </span>
            )}
          </div>
          <Link to="/notifications" className="relative text-[#c4c0ff] p-2 rounded-full hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-error text-[9px] font-bold text-white shadow animate-pulse border border-[#131318]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* SideNavBar (Desktop Only) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full p-6 w-64 bg-[#0e0e13] border-r border-[#464555]/20 z-40 pt-28">
        <nav className="flex-1 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-medium text-sm transition-all ${pathname === '/' ? 'bg-[#2a292f] text-[#c4c0ff] translate-x-1' : 'text-slate-500 hover:bg-[#1b1b20] hover:text-[#c4c0ff]'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link to="/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-medium text-sm transition-all ${pathname === '/analytics' ? 'bg-[#2a292f] text-[#c4c0ff] translate-x-1' : 'text-slate-500 hover:bg-[#1b1b20] hover:text-[#c4c0ff]'}`}>
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </Link>
          <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-medium text-sm transition-all ${pathname === '/profile' ? 'bg-[#2a292f] text-[#c4c0ff] translate-x-1' : 'text-slate-500 hover:bg-[#1b1b20] hover:text-[#c4c0ff]'}`}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>
        <div className="mt-auto border-t border-outline-variant/10 pt-6">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-error transition-all font-headline font-medium text-sm">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 pt-28 pb-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-[40] flex justify-around items-center px-6 pb-8 pt-4 bg-[#131318]/90 backdrop-blur-lg rounded-t-3xl border-t border-[#464555]/20 shadow-[0_-10px_30px_rgba(108,99,255,0.15)]">
        <Link to="/" className={`flex flex-col items-center justify-center scale-90 duration-150 ${pathname === '/' ? 'text-[#c4c0ff] bg-[#c4c0ff]/10 rounded-xl px-4 py-2' : 'text-slate-500 active:bg-[#2a292f]'}`}>
          <span className="material-symbols-outlined mb-1" style={pathname === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
          <span className="font-headline text-[10px] uppercase tracking-widest">Dashboard</span>
        </Link>
        <Link to="/analytics" className={`flex flex-col items-center justify-center scale-90 duration-150 ${pathname === '/analytics' ? 'text-[#c4c0ff] bg-[#c4c0ff]/10 rounded-xl px-4 py-2' : 'text-slate-500 active:bg-[#2a292f]'}`}>
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="font-headline text-[10px] uppercase tracking-widest">Analytics</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center scale-90 duration-150 ${pathname === '/profile' || pathname === '/notifications' ? 'text-[#c4c0ff] bg-[#c4c0ff]/10 rounded-xl px-4 py-2' : 'text-slate-500 active:bg-[#2a292f]'}`}>
          <span className="material-symbols-outlined mb-1">settings</span>
          <span className="font-headline text-[10px] uppercase tracking-widest">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
