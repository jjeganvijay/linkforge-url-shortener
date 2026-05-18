import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MousePointerClick,
  Clock,
  Monitor,
  Globe,
  QrCode,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import CopyButton from '../components/CopyButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatDate, truncateUrl } from '../utils/validators';

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, qrRes] = await Promise.all([
        api.get(`/analytics/${id}`),
        api.get(`/links/${id}/qr`),
      ]);
      setData(analyticsRes.data.data);
      setQrCode(qrRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <ErrorAlert message={error} onRetry={fetchAnalytics} />
        </div>
      </div>
    );
  }

  const { link, analytics } = data;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Link Analytics</h1>
          <p className="mt-1 text-sm text-slate-400" title={link.originalUrl}>
            {truncateUrl(link.originalUrl, 70)}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-brand-400">{link.shortUrl}</span>
            <CopyButton text={link.shortUrl} />
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
              <MousePointerClick className="h-6 w-6 text-brand-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analytics.totalClicks}</p>
              <p className="text-sm text-slate-400">Total Clicks</p>
            </div>
          </div>

          <div className="card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20">
              <Clock className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {analytics.lastVisitedAt ? formatDate(analytics.lastVisitedAt) : 'Never'}
              </p>
              <p className="text-sm text-slate-400">Last Visited</p>
            </div>
          </div>

          <div className="card flex flex-col items-center justify-center">
            <QrCode className="mb-2 h-5 w-5 text-slate-400" />
            {qrCode && (
              <QRCodeSVG value={qrCode.shortUrl} size={100} bgColor="#0f172a" fgColor="#e2e8f0" />
            )}
            <p className="mt-2 text-xs text-slate-500">Scan to visit</p>
          </div>
        </div>

        {analytics.dailyClicks.length > 0 && (
          <div className="card mb-8">
            <h2 className="mb-4 text-lg font-semibold text-white">Daily Clicks (30 days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Visits</h2>

          {analytics.recentVisits.length === 0 ? (
            <p className="py-8 text-center text-slate-400">No visits yet. Share your link!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Time</th>
                    <th className="pb-3 pr-4 font-medium">
                      <Monitor className="inline h-4 w-4" /> Device
                    </th>
                    <th className="pb-3 pr-4 font-medium">
                      <Globe className="inline h-4 w-4" /> Browser
                    </th>
                    <th className="pb-3 font-medium">OS</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentVisits.map((visit, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="py-3 pr-4 text-slate-300">{formatDate(visit.visitedAt)}</td>
                      <td className="py-3 pr-4 capitalize text-slate-300">{visit.device}</td>
                      <td className="py-3 pr-4 text-slate-300">{visit.browser}</td>
                      <td className="py-3 text-slate-300">{visit.os}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
