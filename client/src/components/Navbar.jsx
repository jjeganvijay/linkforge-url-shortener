import { Link } from 'react-router-dom';
import { Link2, LogOut, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function UserAvatar({ name }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-heart-coral text-sm font-bold text-white shadow-md"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-app-raised/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to={user ? '/dashboard' : '/'}
          className="group flex items-center gap-2.5 transition"
        >
          <div className="icon-badge h-10 w-10 rounded-xl transition group-hover:scale-105">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight gradient-text">Shortly</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard" className="btn-ghost hidden sm:inline-flex">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/stats" className="btn-ghost hidden sm:inline-flex">
              <BarChart3 className="h-4 w-4" />
              Stats
            </Link>
            <div className="hidden h-6 w-px bg-slate-700 sm:block" />
            <div className="flex items-center gap-2 pl-1">
              <UserAvatar name={user.name} />
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-200 md:inline">
                {user.name}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="btn-ghost text-slate-400"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/stats" className="btn-ghost">
              Public stats
            </Link>
            <Link to="/login" className="btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link to="/signup" className="btn-primary py-2 text-sm">
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
