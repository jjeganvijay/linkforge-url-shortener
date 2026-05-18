import { Link } from 'react-router-dom';
import { ExternalLink, BarChart3, Trash2, MousePointerClick } from 'lucide-react';
import CopyButton from './CopyButton';
import { formatDate, truncateUrl } from '../utils/validators';

export default function LinkCard({ link, onDelete, deleting }) {
  return (
    <div className="card group transition hover:border-slate-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-brand-400 hover:text-brand-300"
            >
              {link.shortUrl}
            </a>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" />
          </div>

          <p className="text-sm text-slate-400" title={link.originalUrl}>
            {truncateUrl(link.originalUrl, 60)}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>Created {formatDate(link.createdAt)}</span>
            <span className="flex items-center gap-1">
              <MousePointerClick className="h-3.5 w-3.5" />
              {link.clickCount} clicks
            </span>
            {link.customAlias && (
              <span className="rounded bg-slate-800 px-2 py-0.5 text-brand-400">
                alias: {link.customAlias}
              </span>
            )}
            {link.expiresAt && (
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-400">
                Expires {formatDate(link.expiresAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CopyButton text={link.shortUrl} />
          <Link
            to={`/analytics/${link.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </Link>
          <button
            onClick={() => onDelete(link.id)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
