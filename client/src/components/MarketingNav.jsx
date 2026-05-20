import { Link } from 'react-router-dom';
import { Link2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MarketingNav({ showStats = true }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleFeaturesClick = () => {
    if (window.location.pathname !== '/') {
      window.location.assign('/#features');
      return;
    }

    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/#features');
    }
  };

  return (
    <header className="marketing-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className="icon-badge h-9 w-9 rounded-lg">
            <Link2 className="h-4 w-4 text-white" />
          </div>
          <div>
          <span className="text-base font-semibold tracking-tight text-white">Shortly</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted">
              URL shortener
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 text-sm text-muted md:flex">
          {!user && (
            <button
              type="button"
              onClick={handleFeaturesClick}
              className="rounded-xl px-3 py-2 font-medium transition hover:bg-white/5 hover:text-white"
            >
              Features
            </button>
          )}
          {showStats && (
            <Link
              to="/stats"
              className="rounded-xl px-3 py-2 font-medium transition hover:bg-white/5 hover:text-white"
            >
              Public stats
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-icon"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <Link to="/dashboard" className="btn-primary py-2 text-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
