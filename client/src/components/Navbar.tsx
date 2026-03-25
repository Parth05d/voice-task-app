import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../context/AuthContext';
import { LayoutDashboard, LogOut, CheckSquare } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b-0 border-t-0 border-x-0 !rounded-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <CheckSquare size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">VoiceTask</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
              Tasks
            </Link>
            <Link to="/analytics" className="text-sm font-medium text-textMuted hover:text-white transition-colors flex items-center gap-2">
              <LayoutDashboard size={16} />
              Analytics
            </Link>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-textMuted hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
