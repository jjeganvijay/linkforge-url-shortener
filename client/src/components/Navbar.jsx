import { Link } from 'react-router-dom';
import { Link2, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-bold text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Link2 className="h-5 w-5" />
          </div>
          LinkForge
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/stats"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Public stats
            </Link>
            <span className="text-sm text-slate-500">|</span>
            <span className="text-sm text-slate-300">{user.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
