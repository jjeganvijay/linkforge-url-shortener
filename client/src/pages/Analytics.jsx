import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MousePointerClick, Clock, Monitor, Globe, QrCode } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { QRCodeSVG } from "qrcode.react";
import api from "../api/axios";
import CopyButton from "../components/CopyButton";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import PageHeader from "../components/PageHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useTheme } from "../context/ThemeContext";
import { formatDate, truncateUrl } from "../utils/validators";

export default function Analytics() {
  useDocumentTitle("Link analytics");
  const { id } = useParams();
  const location = useLocation();
  const { isDark } = useTheme();
  const backTo = location.state?.from || "/dashboard/analytics";
  const [data, setData] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rangeDays, setRangeDays] = useState(30);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, qrRes] = await Promise.all([
        api.get(`/analytics/${id}`, { params: { days: rangeDays } }),
        api.get(`/links/${id}/qr`),
      ]);
      setData(analyticsRes.data.data);
      setQrCode(qrRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      const res = await api.get(`/analytics/${id}/export.csv`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `visits-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to export CSV");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id, rangeDays]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your insights..." />;
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={fetchAnalytics} />;
  }

  const { link, analytics } = data;
  const qrBg = isDark ? "#2a1f3d" : "#faf5ff";
  const qrFg = isDark ? "#e2e8f0" : "#1e1b4b";
  const chartGrid = isDark ? "#334155" : "#e2e8f0";
  const chartAxis = isDark ? "#94a3b8" : "#64748b";
  const tooltipStyle = {
    backgroundColor: isDark ? "#221530" : "#ffffff",
    border: isDark
      ? "1px solid rgba(244, 114, 182, 0.3)"
      : "1px solid rgba(139, 92, 246, 0.2)",
    borderRadius: "12px",
    color: isDark ? "#f5f3ff" : "#1e1b4b",
  };

  const deviceBreakdown = analytics.recentVisits.reduce((acc, v) => {
    const key = v.device || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Link performance"
        subtitle={truncateUrl(link.originalUrl, 70)}
        backTo={backTo}
        backLabel={
          backTo.includes("links") ? "Back to my links" : "Back to analytics"
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-brand-400">{link.shortUrl}</span>
          <CopyButton text={link.shortUrl} />
          <label className="sr-only" htmlFor="rangeDays">
            Date range
          </label>
          <select
            id="rangeDays"
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="input-field !w-auto !py-2 !px-3 text-sm"
            title="Analytics date range"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button type="button" onClick={downloadCsv} className="btn-secondary">
            Export CSV
          </button>
        </div>
      </PageHeader>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card-interactive flex items-center gap-4">
          <div className="icon-circle-warm h-12 w-12 rounded-lg">
            <MousePointerClick className="h-6 w-6 text-heart-rose" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {analytics.totalClicks}
            </p>
            <p className="text-sm text-slate-400">Total Clicks</p>
          </div>
        </div>

        <div className="card-interactive flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20">
            <Clock className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {analytics.lastVisitedAt
                ? formatDate(analytics.lastVisitedAt)
                : "Never"}
            </p>
            <p className="text-sm text-slate-400">Last Visited</p>
          </div>
        </div>

        <div className="card-interactive flex flex-col items-center justify-center">
          <QrCode className="mb-2 h-5 w-5 text-slate-400" />
          {qrCode && (
            <QRCodeSVG
              value={qrCode.shortUrl}
              size={100}
              bgColor={qrBg}
              fgColor={qrFg}
            />
          )}
          <p className="mt-2 text-xs text-slate-500">Scan to visit</p>
        </div>
      </div>

      {Object.keys(deviceBreakdown).length > 0 && (
        <div className="card mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Device mix (recent visits)
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(deviceBreakdown).map(([device, count]) => (
              <span key={device} className="badge-soft capitalize">
                {device}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {analytics.dailyClicks.length > 0 && (
        <div className="card mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Daily Clicks (30 days)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="date" stroke={chartAxis} fontSize={12} />
              <YAxis stroke={chartAxis} fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {(analytics.topBrowsers?.length > 0 ||
        analytics.topCountries?.length > 0 ||
        analytics.topReferrers?.length > 0 ||
        analytics.topCampaigns?.length > 0) && (
        <div className="grid gap-8 mb-8 sm:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Top Browsers
            </h2>
            <div className="space-y-2">
              {(analytics.topBrowsers || []).map((b, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-slate-300">{b.name}</span>
                  <span className="text-sm font-semibold text-brand-400">
                    {b.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Top Countries
            </h2>
            <div className="space-y-2">
              {(analytics.topCountries || []).slice(0, 5).map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm text-slate-300">{c.name}</span>
                    <span className="text-sm font-semibold text-brand-400">
                      {c.count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-white">Top Referrers</h2>
            <div className="space-y-2">
              {(analytics.topReferrers || []).slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-slate-300">{r.name}</span>
                  <span className="text-sm font-semibold text-brand-400">{r.count}</span>
                </div>
              ))}
              {(!analytics.topReferrers || analytics.topReferrers.length === 0) && (
                <p className="text-sm text-muted">No referrer data yet.</p>
              )}
            </div>
          </div>
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-white">Top Campaigns</h2>
            <div className="space-y-2">
              {(analytics.topCampaigns || []).slice(0, 5).map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-slate-300">{c.name}</span>
                  <span className="text-sm font-semibold text-brand-400">{c.count}</span>
                </div>
              ))}
              {(!analytics.topCampaigns || analytics.topCampaigns.length === 0) && (
                <p className="text-sm text-muted">No UTM campaign data yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Visits</h2>

        {analytics.recentVisits.length === 0 ? (
          <p className="py-8 text-center text-muted">
            No visits yet — share your link and watch the numbers grow.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>
                    <Monitor className="inline h-4 w-4" /> Device
                  </th>
                  <th>
                    <Globe className="inline h-4 w-4" /> Browser
                  </th>
                  <th>Country</th>
                  <th>OS</th>
                  <th>Referrer</th>
                  <th>Campaign</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentVisits.map((visit, i) => (
                  <tr key={i}>
                    <td>{formatDate(visit.visitedAt)}</td>
                    <td className="capitalize">{visit.device}</td>
                    <td>{visit.browser}</td>
                    <td>{visit.country || "Unknown"}</td>
                    <td>{visit.os}</td>
                    <td className="truncate max-w-[10rem]">
                      {visit.referrerHost || "Direct"}
                    </td>
                    <td className="truncate max-w-[10rem]">
                      {visit.utmCampaign || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
