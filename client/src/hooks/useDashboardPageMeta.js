import { useLocation } from 'react-router-dom';

const ROUTES = {
  '/dashboard': { title: 'Overview', section: 'Dashboard' },
  '/dashboard/create': { title: 'Create link', section: 'Workspace' },
  '/dashboard/links': { title: 'My links', section: 'Workspace' },
  '/dashboard/bulk': { title: 'Bulk upload', section: 'Workspace' },
  '/dashboard/analytics': { title: 'Analytics', section: 'Workspace' },
  '/dashboard/qr': { title: 'QR codes', section: 'Workspace' },
  '/dashboard/profile': { title: 'Profile', section: 'Account' },
  '/dashboard/settings': { title: 'Settings', section: 'Account' },
};

export default function useDashboardPageMeta() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/dashboard/analytics/') && pathname !== '/dashboard/analytics') {
    return { title: 'Link analytics', section: 'Workspace' };
  }

  return ROUTES[pathname] || { title: 'Dashboard', section: 'Workspace' };
}
