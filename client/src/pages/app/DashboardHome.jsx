import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Link2,
  Plus,
  List,
  Upload,
  BarChart3,
  QrCode,
  MousePointerClick,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLinks } from '../../context/LinksContext';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { resolvePendingUrl, CREATE_LINK_PATH } from '../../utils/pendingUrl';
import { truncateUrl } from '../../utils/validators';

const quickActions = [
  { to: '/dashboard/create', label: 'Create link', desc: 'Shorten a new URL', icon: Plus },
  { to: '/dashboard/links', label: 'My links', desc: 'View and manage all links', icon: List },
  { to: '/dashboard/bulk', label: 'Bulk upload', desc: 'Import many URLs at once', icon: Upload },
  { to: '/dashboard/analytics', label: 'Analytics', desc: 'See how links perform', icon: BarChart3 },
  { to: '/dashboard/qr', label: 'QR codes', desc: 'Download scannable codes', icon: QrCode },
];

export default function DashboardHome() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const { links, loading } = useLinks();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pending = resolvePendingUrl(location.state);
    if (pending) {
      navigate(CREATE_LINK_PATH, { replace: true, state: { pendingUrl: pending } });
    }
  }, [location.state, navigate]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
  const recentLinks = useMemo(() => links.slice(0, 5), [links]);
  const topLink = useMemo(
    () => [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))[0],
    [links]
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Your link performance at a glance."
        showBack={false}
      >
        <Link to="/dashboard/create" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          New link
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingSpinner text="Loading your workspace..." />
      ) : (
        <>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="stat-card">
              <div className="icon-circle-warm h-12 w-12 rounded-xl">
                <Link2 className="h-6 w-6 text-brand-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{links.length}</p>
                <p className="text-sm text-muted">Active links</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-circle-warm h-12 w-12 rounded-xl">
                <MousePointerClick className="h-6 w-6 text-heart-rose" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-300">{totalClicks}</p>
                <p className="text-sm text-muted">Total clicks</p>
              </div>
            </div>
            <div className="stat-card sm:col-span-2 lg:col-span-2">
              <div className="icon-circle-warm h-12 w-12 rounded-xl">
                <BarChart3 className="h-6 w-6 text-brand-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {topLink ? topLink.shortUrl : 'No traffic yet'}
                </p>
                <p className="text-sm text-muted">
                  {topLink
                    ? `${topLink.clickCount || 0} clicks · top performer`
                    : 'Create and share a link to see stats'}
                </p>
              </div>
            </div>
          </div>

          {links.length === 0 ? (
            <EmptyState
              icon={Link2}
              title="Start your first campaign"
              description="Shorten a URL to get analytics, QR codes, and shareable links in seconds."
              actionLabel="Create your first link"
              actionTo="/dashboard/create"
            />
          ) : (
            <>
              <section className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="section-title">Recent links</h2>
                  <Link to="/dashboard/links" className="text-sm text-brand-300 hover:text-brand-200">
                    View all
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentLinks.map((link) => (
                    <Link
                      key={link.id}
                      to={`/dashboard/analytics/${link.id}`}
                      state={{ from: '/dashboard' }}
                      className="card-interactive flex items-center justify-between gap-4 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-brand-300">{link.shortUrl}</p>
                        <p className="truncate text-xs text-muted">{truncateUrl(link.originalUrl, 50)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="badge-clicks">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          {link.clickCount || 0}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <h2 className="section-title mb-4">Quick actions</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map(({ to, label, desc, icon: Icon }) => (
                  <Link key={to} to={to} className="action-card group">
                    <div className="action-card-icon">
                      <Icon className="h-5 w-5 text-brand-300" />
                    </div>
                    <p className="font-semibold text-white">{label}</p>
                    <p className="mt-1 text-sm text-muted">{desc}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

