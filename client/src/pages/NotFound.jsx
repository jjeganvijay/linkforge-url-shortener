import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <p className="text-6xl font-bold text-brand-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-slate-400">The page you are looking for does not exist.</p>
        <Link to={user ? '/dashboard' : '/login'} className="btn-primary mt-8">
          <Home className="h-4 w-4" />
          {user ? 'Back to dashboard' : 'Go to login'}
        </Link>
      </main>
    </div>
  );
}
