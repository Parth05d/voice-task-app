import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Layout } from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">Loading...</div>;
  if (!session) return <Navigate to='/login' replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/analytics' element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
