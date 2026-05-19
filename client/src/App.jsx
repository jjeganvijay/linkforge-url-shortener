import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import PublicStats from './pages/PublicStats';
import LinkError from './pages/LinkError';
import NotFound from './pages/NotFound';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/stats" element={<PublicStats />} />
      <Route path="/link-error" element={<LinkError />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics/:id" element={<Analytics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
