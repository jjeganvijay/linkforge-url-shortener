import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Link2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import MarketingNav from '../components/MarketingNav';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { resolvePendingUrl, CREATE_LINK_PATH } from '../utils/pendingUrl';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function Signup() {
  useDocumentTitle('Sign up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success(`Welcome, ${name.split(' ')[0]}! Your journey starts now.`);
      const pendingUrl = resolvePendingUrl(location.state);
      navigate(
        pendingUrl ? CREATE_LINK_PATH : '/dashboard',
        pendingUrl ? { state: { pendingUrl } } : { replace: true }
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell showFooter={false}>
      <MarketingNav showStats={false} />
      <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 max-w-md animate-fade-in-up text-center">
          <div className="icon-badge mx-auto mb-4 h-14 w-14">
            <Link2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Start sharing with <span className="gradient-text">confidence</span>
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            Join Shortly — shorten links, track clicks, and grow your reach without the stress.
          </p>
        </div>

        <div className="card w-full max-w-md animate-fade-in-up stagger-1">
          {resolvePendingUrl(location.state) && (
            <div className="info-banner mb-4 px-4 py-3 text-sm text-violet-100">
              Your URL is saved — you can shorten it right after sign up.
            </div>
          )}

          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-white">Create your free account</h2>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500">
              <Heart className="h-3 w-3 text-accent-coral" /> Takes less than a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Your name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="What should we call you?"
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

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
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating your space...' : 'Create account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-800/80" />
            <span>or</span>
            <div className="h-px flex-1 bg-slate-800/80" />
          </div>

          <GoogleSignInButton label="Sign up with Google" />

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-brand-400 hover:text-brand-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
