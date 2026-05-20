import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Link2, Home, LogIn, Unlink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';

export default function LinkError() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const reason = searchParams.get('reason') || 'notfound';
  const code = searchParams.get('code') || '';

  const isExpired = reason === 'expired';
  const isInvalid = reason === 'invalid';

  return (
    <PageShell>
      <header className="border-b border-white/5 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-center">
          <Link to={user ? '/dashboard' : '/login'} className="flex items-center gap-2 font-bold text-white">
            <div className="icon-badge h-9 w-9 rounded-xl">
              <Link2 className="h-5 w-5" />
            </div>
            <span className="gradient-text">Shortly</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="card w-full max-w-md animate-fade-in-up text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
              isExpired ? 'bg-amber-500/20' : 'bg-red-500/20'
            }`}
          >
            {isExpired ? (
              <Clock className="h-8 w-8 text-amber-400" />
            ) : (
              <Unlink className="h-8 w-8 text-red-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isExpired
              ? 'This link has run its course'
              : isInvalid
                ? 'This link is currently unavailable'
                : "We couldn't find that link"}
          </h1>
          <p className="mt-3 text-muted leading-relaxed">
            {isExpired
              ? 'The owner set an expiry date — this short link no longer redirects, but you can still create fresh ones.'
              : isInvalid
                ? "We couldn't open this link due to a configuration issue. Ask the owner to regenerate it."
                : 'Double-check the short code, or ask whoever shared it with you.'}
          </p>
          {code && (
            <p className="mt-4 rounded-xl bg-app-raised/80 px-3 py-2 font-mono text-sm text-brand-300">
              /{code}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to={user ? '/dashboard' : '/login'} className="btn-primary">
              <Home className="h-4 w-4" />
              {user ? 'Back to dashboard' : 'Go home'}
            </Link>
            {!user && (
              <Link to="/login" className="btn-secondary">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
