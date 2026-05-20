import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wand2,
  Sparkles,
  Calendar,
  QrCode,
  BarChart3,
  ArrowRight,
  Shield,
  Lock,
  Zap,
  MousePointerClick,
  ClipboardCopy,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import { isValidUrl } from '../utils/validators';
import { savePendingUrl, CREATE_LINK_PATH } from '../utils/pendingUrl';
import MarketingNav from '../components/MarketingNav';
import useDocumentTitle from '../hooks/useDocumentTitle';

const features = [
  {
    icon: Sparkles,
    title: 'Custom alias',
    desc: 'Memorable short codes you choose.',
    color: 'text-brand-300',
    bg: 'bg-brand-600/20',
  },
  {
    icon: Calendar,
    title: 'Link expiry',
    desc: 'Stop redirects after a set date.',
    color: 'text-heart-peach',
    bg: 'bg-heart-coral/15',
  },
  {
    icon: QrCode,
    title: 'QR codes',
    desc: 'Download PNG codes instantly.',
    color: 'text-heart-gold',
    bg: 'bg-amber-500/15',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Clicks, devices, and geography.',
    color: 'text-heart-blush',
    bg: 'bg-heart-rose/15',
  },
];

const trustPoints = [
  { icon: Lock, label: 'AES-256 encrypted URLs at rest' },
  { icon: Shield, label: 'JWT auth & rate limiting' },
  { icon: Zap, label: 'Sub-second redirects' },
];

export default function Landing() {
  useDocumentTitle('Home');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleShorten = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError('Paste a URL to shorten');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setUrlError('Enter a valid URL (include https://)');
      return;
    }
    setUrlError('');
    savePendingUrl(trimmed);
    if (user) {
      navigate(CREATE_LINK_PATH, { state: { pendingUrl: trimmed } });
    } else {
      navigate('/signup', { state: { pendingUrl: trimmed } });
    }
  };

  return (
    <PageShell>
      <MarketingNav />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:pt-16">
        <section className="animate-fade-in-up text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-400">
            Enterprise-grade link management
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-tight">
            Short links with{' '}
            <span className="gradient-text">analytics built in</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted leading-relaxed sm:text-lg">
            Create, manage, and measure every link from one dashboard — built for campaigns,
            portfolios, and everyday sharing.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-3xl animate-fade-in-up stagger-1">
          <form onSubmit={handleShorten} className="card p-5 sm:p-6">
            <label htmlFor="landing-url" className="mb-2 block text-left text-sm font-medium text-slate-300">
              Paste a long URL
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="landing-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError('');
                }}
                className="input-field flex-1"
                placeholder="https://example.com/your-page"
              />
              <button type="submit" className="btn-primary shrink-0 sm:px-8">
                <Wand2 className="h-4 w-4" />
                Shorten
              </button>
            </div>
            {urlError && <p className="mt-2 text-xs text-red-400">{urlError}</p>}
            <p className="mt-3 text-center text-xs text-muted">
              {user
                ? 'Opens create link with your URL pre-filled.'
                : 'Free account — your URL is saved until you sign up.'}
            </p>
          </form>

          <section className="mt-14 animate-fade-in-up stagger-2">
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white">How it works</h2>
              <p className="mt-2 text-sm text-muted">
                Three quick steps from long URL to measurable results.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="feature-tile rounded-xl p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/20">
                    <Wand2 className="h-5 w-5 text-brand-300" />
                  </div>
                  <p className="text-sm font-semibold text-white">Shorten</p>
                  <p className="mt-1 text-xs text-muted">
                    Paste a link and get a clean short URL instantly.
                  </p>
                </div>
                <div className="feature-tile rounded-xl p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-heart-coral/15">
                    <ClipboardCopy className="h-5 w-5 text-heart-blush" />
                  </div>
                  <p className="text-sm font-semibold text-white">Share</p>
                  <p className="mt-1 text-xs text-muted">
                    Copy, QR, or campaign links with UTM tracking.
                  </p>
                </div>
                <div className="feature-tile rounded-xl p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                    <MousePointerClick className="h-5 w-5 text-heart-gold" />
                  </div>
                  <p className="text-sm font-semibold text-white">Measure</p>
                  <p className="mt-1 text-xs text-muted">
                    Open your dashboard to see clicks, referrers, and trends.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="icon-circle-warm h-11 w-11 rounded-xl">
                    <LayoutDashboard className="h-5 w-5 text-brand-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Built for real use</p>
                    <p className="text-xs text-muted">
                      Analytics, campaigns, expiry, QR, and bulk tools — all in one place.
                    </p>
                  </div>
                </div>
                <Link to={user ? '/dashboard' : '/signup'} className="btn-secondary">
                  {user ? 'Open dashboard' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <section id="features" className="mt-16 scroll-mt-28">
            <div className="mb-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">
                Features
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Everything you need to share with confidence
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
                Custom aliases, expiry, QR codes, and analytics that help you learn what works.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="feature-tile rounded-xl p-4 text-center">
                  <div
                    className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-1 text-xs text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-16 text-center animate-fade-in-up stagger-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
            {trustPoints.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-brand-400" />
                {label}
              </span>
            ))}
          </div>
          <Link to={user ? '/dashboard' : '/signup'} className="btn-primary mt-6 inline-flex">
            {user ? 'Open dashboard' : 'Create free account'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
