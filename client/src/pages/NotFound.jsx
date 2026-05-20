import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import PageShell from '../components/PageShell';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  useDocumentTitle('Page not found');
  const { user } = useAuth();

  return (
    <PageShell>
      <MarketingNav showStats={false} />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="icon-circle-warm mb-6 h-16 w-16">
          <Compass className="h-8 w-8 text-brand-300" />
        </div>
        <p className="text-6xl font-bold gradient-text">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">You wandered off the map</h1>
        <p className="mt-2 text-muted leading-relaxed">
          This page does not exist — but your links are waiting on the dashboard.
        </p>
        <Link to={user ? '/dashboard' : '/'} className="btn-primary mt-8">
          <Home className="h-4 w-4" />
          {user ? 'Back to dashboard' : 'Back to home'}
        </Link>
      </main>
    </PageShell>
  );
}
