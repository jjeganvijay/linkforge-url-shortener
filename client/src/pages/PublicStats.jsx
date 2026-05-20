import { useState } from 'react';
import { BarChart3, Search } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import PageShell from '../components/PageShell';
import PageHeader from '../components/PageHeader';
import useDocumentTitle from '../hooks/useDocumentTitle';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatDate } from '../utils/validators';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function PublicStats() {
  useDocumentTitle('Public stats');
  const [shortCode, setShortCode] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    const code = shortCode.trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    setStats(null);
    try {
      const res = await axios.get(`${API_URL}/public/${code}/stats`);
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Link not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <MarketingNav />

      <main className="mx-auto max-w-2xl px-4 py-8 pb-16 sm:px-6">
        <PageHeader
          title="Public link stats"
          subtitle="Look up click counts for any short code — no sign-in required."
          backTo="/"
          backLabel="Back to home"
          showBack
        />

        <form onSubmit={handleLookup} className="card-interactive mb-6 animate-fade-in-up stagger-1">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Short code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              className="input-field flex-1"
              placeholder="abc1234"
            />
            <button type="submit" className="btn-primary shrink-0">
              <Search className="h-4 w-4" />
              Lookup
            </button>
          </div>
        </form>

        {loading && <LoadingSpinner text="Looking up link..." />}
        {error && <ErrorAlert message={error} />}
        {stats && (
          <div className="card animate-fade-in-up space-y-4 text-center">
            <p className="text-sm text-slate-400">Short code</p>
            <p className="font-mono text-xl font-semibold text-brand-300">/{stats.shortCode}</p>
            <p className="text-4xl font-bold text-white">{stats.totalClicks}</p>
            <p className="text-muted">{stats.totalClicks === 1 ? 'person clicked' : 'people clicked'}</p>
            <p className="text-xs text-slate-500">Created {formatDate(stats.createdAt)}</p>
          </div>
        )}
      </main>
    </PageShell>
  );
}
