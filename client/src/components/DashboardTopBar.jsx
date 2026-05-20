import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useDashboardPageMeta from '../hooks/useDashboardPageMeta';

export default function DashboardTopBar({ onOpenMenu }) {
  const { title, section } = useDashboardPageMeta();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const initial = (user?.name || '?').charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-topbar">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="btn-icon lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link
          to="/dashboard/profile"
          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:border-white/20 hover:bg-white/10"
          title="Your profile"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 text-xs font-bold text-white">
            {initial}
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-medium text-white">{user?.name}</span>
            <span className="block truncate text-[11px] text-muted">{user?.email}</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-icon text-slate-300 hover:text-red-300"
          title="Log out"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="hidden min-w-0 px-2 text-center sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{section}</p>
        <p className="truncate text-sm font-medium text-white">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
