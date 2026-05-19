import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Link2, Home, LogIn, Unlink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LinkError() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const reason = searchParams.get('reason') || 'notfound';
  const code = searchParams.get('code') || '';

  const isExpired = reason === 'expired';

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-center">
          <Link to={user ? '/dashboard' : '/login'} className="flex items-center gap-2 font-bold text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Link2 className="h-5 w-5" />
            </div>
            LinkForge
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="card w-full max-w-md text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
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
            {isExpired ? 'This link has expired' : 'Link not found'}
          </h1>
          <p className="mt-3 text-slate-400">
            {isExpired
              ? 'The owner set an expiry date and this short link no longer redirects.'
              : 'This short code does not exist or has been removed.'}
          </p>
          {code && (
            <p className="mt-4 rounded-lg bg-slate-800 px-3 py-2 font-mono text-sm text-brand-400">
              /{code}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to={user ? '/dashboard' : '/login'} className="btn-primary">
              <Home className="h-4 w-4" />
              {user ? 'Go to dashboard' : 'Go to home'}
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
    </div>
  );
}
