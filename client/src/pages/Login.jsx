import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Link2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import MarketingNav from '../components/MarketingNav';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { resolvePendingUrl, CREATE_LINK_PATH } from '../utils/pendingUrl';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function Login() {
  useDocumentTitle('Sign in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionNotice =
    searchParams.get('session') === 'expired'
      ? 'Your session expired (login lasts 7 days). Please sign in again.'
      : searchParams.get('session') === 'required'
        ? 'Please sign in to continue.'
        : null;

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! Great to see you again.');
      const pendingUrl = resolvePendingUrl(location.state);
      const returnTo =
        location.state?.from ||
        (searchParams.get('redirect')?.startsWith('/') ? searchParams.get('redirect') : null);
      if (pendingUrl) {
        navigate(CREATE_LINK_PATH, { state: { pendingUrl } });
      } else if (returnTo && returnTo.startsWith('/')) {
        navigate(returnTo, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell showFooter={false}>
      <MarketingNav showStats />
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 max-w-md animate-fade-in-up text-center">
          <div className="icon-badge mx-auto mb-4 h-14 w-14">
            <Link2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back to <span className="gradient-text">Shortly</span>
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Your links are waiting. Sign in and pick up right where you left off.
          </p>
        </div>

        <div className="card w-full max-w-md animate-fade-in-up stagger-1">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-white">Sign in to your account</h2>
            <p className="mt-1 text-xs text-slate-500">Stay signed in for 7 days on this device</p>
          </div>

          {sessionNotice && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {sessionNotice}
            </div>
          )}

          {resolvePendingUrl(location.state) && (
            <div className="info-banner mb-4 px-4 py-3 text-sm text-violet-100">
              After sign in, we will open the create page with your saved URL.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-800/80" />
            <span>or</span>
            <div className="h-px flex-1 bg-slate-800/80" />
          </div>

          <GoogleSignInButton />

          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{' '}
            <Link
              to="/signup"
              state={location.state}
              className="font-semibold text-brand-400 hover:text-brand-300"
            >
              Create a free account
            </Link>
          </p>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-accent-warm" />
            <Link to="/stats" className="hover:text-slate-300">
              Look up public link stats
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
