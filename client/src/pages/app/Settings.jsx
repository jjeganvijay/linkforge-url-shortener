import { Link } from 'react-router-dom';
import { Sun, Moon, BarChart3, Palette } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useTheme } from '../../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme();

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
    </div>
  );
}
