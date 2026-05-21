import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, BarChart3, Palette, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/PageHeader';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme();
  const { clearSession } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleting) return;

    const ok = window.confirm(
      'Delete your account permanently?\n\nThis will delete all your links and analytics. This cannot be undone.'
    );
    if (!ok) return;

    setDeleting(true);
    try {
      await api.delete('/auth/me');
      toast.success('Account deleted');
      clearSession();
      navigate('/signup', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Settings"
        subtitle="Customize how LinkForge looks and feels."
        backTo="/dashboard/profile"
        backLabel="Back to profile"
      />

      <section className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>
        <p className="mb-4 text-sm text-muted">Choose light or dark theme. Your choice is saved on this device.</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
              theme === 'light'
                ? 'border-brand-500/50 bg-brand-600/20 text-white'
                : 'border-white/10 bg-white/5 text-muted hover:text-white'
            }`}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
              theme === 'dark'
                ? 'border-brand-500/50 bg-brand-600/20 text-white'
                : 'border-white/10 bg-white/5 text-muted hover:text-white'
            }`}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">Currently using {isDark ? 'dark' : 'light'} mode.</p>
      </section>

      <section className="card mt-6 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-white">More</h2>
        </div>
        <Link
          to="/stats"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-violet-100 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          Public stats demo
          <span className="text-brand-300">View →</span>
        </Link>
      </section>

      <section className="card mt-6 border border-red-500/20 bg-red-950/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-red-300" />
          <h2 className="text-lg font-semibold text-white">Danger zone</h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          Deleting your account removes all your links and visit analytics. Custom aliases you owned become available again.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? 'Deleting...' : 'Delete account'}
        </button>
      </section>
    </div>
  );
}
