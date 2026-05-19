import { useState } from 'react';
import { BarChart3, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatDate } from '../utils/validators';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function PublicStats() {
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
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-brand-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">Public link stats</h1>
          <p className="mt-2 text-slate-400">Enter a short code to view click count (no login required)</p>
        </div>

        <form onSubmit={handleLookup} className="card mb-6">
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
          <div className="card space-y-3">
            <p className="text-sm text-slate-400">Short code</p>
            <p className="text-xl font-semibold text-brand-400">{stats.shortCode}</p>
            <p className="text-3xl font-bold text-white">{stats.totalClicks} clicks</p>
            <p className="text-sm text-slate-500">Created {formatDate(stats.createdAt)}</p>
          </div>
        )}
      </main>
    </div>
  );
}
