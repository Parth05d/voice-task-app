import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { session } = useAuth();
  const userEmail = session?.user?.email || 'User';
  
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
    
    // Listen for manual updates from the Notifications page
    window.addEventListener('notifications_updated', fetchUnread);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('notifications_updated', fetchUnread);
    };
  }, [session, pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Analytics', path: '/analytics', icon: 'analytics' },
    { name: 'Profile', path: '/profile', icon: 'person' }
  ];

  return (
    <div className="font-body text-on-surface bg-background">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-[#131318]/80 backdrop-blur-xl z-50 tonal-shift-bg">
        <div className="text-2xl font-black tracking-tighter text-[#c4c0ff] flex items-center gap-2 font-headline">
          <span className="material-symbols-outlined text-[#c4c0ff]">keyboard_voice</span>
          VOX_TASK
        </div>
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="relative text-slate-400 hover:text-[#c4c0ff] transition-colors duration-300">
            <span className="material-symbols-outlined text-[28px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-error text-[10px] font-bold text-white shadow shadow-error/30 animate-pulse border border-[#131318]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* NavigationDrawer (Desktop) */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full p-6 bg-[#0e0e13] w-64 border-r border-[#464555]/20 z-40">
        <div className="mb-12 mt-4 px-2">
          <div className="text-xl font-bold text-[#c4c0ff] font-headline mb-8">VOX AI</div>
          <div className="flex items-center gap-3 p-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 overflow-hidden text-primary">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div>
              <p className="font-headline font-bold text-[#c4c0ff] text-sm truncate w-32">{userEmail}</p>
              <p className="text-[10px] text-slate-500 font-mono">VOX AI Active</p>
            </div>
          </div>
          <div className="space-y-2">
            {navLinks.map(link => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#2a292f] text-[#c4c0ff] translate-x-1'
                      : 'text-slate-500 hover:bg-[#1b1b20] hover:text-[#c4c0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span> {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="pt-28 pb-32 lg:pb-12 px-6 lg:pl-80 lg:pr-16 max-w-[100vw] mx-auto min-h-screen">
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-[#131318]/90 backdrop-blur-lg border-t border-[#464555]/20 shadow-[0_-10px_30px_rgba(108,99,255,0.15)] rounded-t-3xl">
        {navLinks.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center scale-90 duration-150 ${
                isActive
                  ? 'text-[#c4c0ff] bg-[#c4c0ff]/10 rounded-xl px-4 py-2'
                  : 'text-slate-500 active:bg-[#2a292f]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{link.icon}</span>
              <span className="font-headline text-[10px] uppercase tracking-widest mt-1">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
