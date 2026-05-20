import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ChevronRight, MousePointerClick, Search, ArrowUpDown } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useLinks } from '../../context/LinksContext';
import { truncateUrl } from '../../utils/validators';

export default function AnalyticsHub() {
  useDocumentTitle('Analytics');
  const { links, loading, error, refreshLinks } = useLinks();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('clicks_desc'); // clicks_desc | created_desc | created_asc

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? links.filter((l) => {
          const haystack = `${l.shortUrl} ${l.shortCode} ${l.originalUrl}`.toLowerCase();
          return haystack.includes(q);
        })
      : links;

    const arr = [...filtered];
    if (sortBy === 'created_asc') {
      arr.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'created_desc') {
      arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      arr.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    }
    return arr;
  }, [links, query, sortBy]);
  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics"
        subtitle="Open any link for charts, visits, devices, and QR insights."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      >
        {!loading && links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search links..."
                className="input-field pl-10 sm:w-72"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field pl-10 !w-auto"
                title="Sort"
              >
                <option value="clicks_desc">Most clicks</option>
                <option value="created_desc">Newest</option>
                <option value="created_asc">Oldest</option>
              </select>
            </div>
          </div>
        )}
      </PageHeader>

      {!loading && (
        <div className="card mb-8 flex items-center gap-4 p-5">
          <div className="icon-circle-warm h-14 w-14 rounded-xl">
            <BarChart3 className="h-7 w-7 text-brand-300" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{totalClicks}</p>
            <p className="text-sm text-muted">Total clicks across all links</p>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading analytics..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={refreshLinks} />
      ) : sorted.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-muted">
            {links.length === 0 ? 'Create a link first to see analytics here.' : 'No links match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((link) => (
            <Link
              key={link.id}
              to={`/dashboard/analytics/${link.id}`}
              state={{ from: '/dashboard/analytics' }}
              className="card-interactive flex items-center justify-between gap-4 p-5 transition hover:border-brand-500/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-brand-300">{link.shortUrl}</p>
                <p className="mt-1 truncate text-sm text-muted" title={link.originalUrl}>
                  {truncateUrl(link.originalUrl, 55)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="badge-clicks">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  {link.clickCount || 0}
                </span>
                <ChevronRight className="h-5 w-5 text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
