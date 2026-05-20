import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Link2,
  LayoutDashboard,
  Plus,
  List,
  BarChart3,
  Upload,
  QrCode,
  User,
  Settings,
  X,
} from 'lucide-react';
import { LinksProvider } from '../context/LinksContext';
import PageShell from './PageShell';
import DashboardTopBar from './DashboardTopBar';

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/create', label: 'Create link', icon: Plus, end: false },
  { to: '/dashboard/links', label: 'My links', icon: List, end: false },
  { to: '/dashboard/bulk', label: 'Bulk upload', icon: Upload, end: false },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/dashboard/qr', label: 'QR codes', icon: QrCode, end: false },
];

const accountNav = [
  { to: '/dashboard/profile', label: 'Profile', icon: User, end: false },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, end: false },
];

function SidebarLink({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-brand-600/90 text-white shadow-sm'
            : 'text-violet-100/90 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </NavLink>
  );
}

function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <PageShell>
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-label="Close menu"
            onClick={closeSidebar}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-app-raised/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <Link to="/dashboard" className="flex items-center gap-2.5" onClick={closeSidebar}>
              <div className="icon-badge h-9 w-9 rounded-lg">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Shortly</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
                  Workspace
                </span>
              </div>
            </Link>
            <button
              type="button"
              className="rounded-lg p-1 text-slate-400 lg:hidden"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Workspace
              </p>
              <div className="space-y-1">
                {mainNav.map((item) => (
                  <SidebarLink key={item.to} {...item} onNavigate={closeSidebar} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Account
              </p>
              <div className="space-y-1">
                {accountNav.map((item) => (
                  <SidebarLink key={item.to} {...item} onNavigate={closeSidebar} />
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopBar onOpenMenu={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-auto px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </PageShell>
  );
}

export default function DashboardLayout() {
  return (
    <LinksProvider>
      <DashboardShell />
    </LinksProvider>
  );
}
