import { Link } from "react-router-dom";
import {
  ExternalLink,
  BarChart3,
  Trash2,
  MousePointerClick,
  Pencil,
} from "lucide-react";
import CopyButton from "./CopyButton";
import { formatDate, truncateUrl } from "../utils/validators";

export default function LinkCard({
  link,
  onDelete,
  onEdit,
  onToggleActive,
  deleting,
  toggling,
  highlight,
  innerRef,
}) {
  return (
    <div
      ref={innerRef}
      className={`card-interactive group ${highlight ? "link-card-highlight" : ""}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-brand-300 transition hover:text-brand-200"
            >
              {link.shortUrl}
            </a>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 opacity-0 transition group-hover:opacity-100" />
          </div>
          <p className="text-sm text-slate-400" title={link.originalUrl}>
            {truncateUrl(link.originalUrl, 60)}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge-soft">{formatDate(link.createdAt)}</span>
            <span className="badge-clicks">
              <MousePointerClick className="h-3.5 w-3.5" />
              {link.clickCount} {link.clickCount === 1 ? "click" : "clicks"}
            </span>
            {link.customAlias && (
              <span className="badge-soft text-brand-400">
                {link.customAlias}
              </span>
            )}
            {link.expiresAt && (
              <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-amber-300">
                Expires {formatDate(link.expiresAt)}
              </span>
            )}
            {!link.isActive && (
              <span className="rounded-lg bg-red-500/15 px-2.5 py-1 text-red-300">
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <CopyButton text={link.shortUrl} label="Copy" />
          {onToggleActive && (
            <button
              type="button"
              onClick={() => onToggleActive(link.id, link.isActive)}
              disabled={toggling}
              className="btn-ghost border border-slate-700/50"
            >
              {link.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(link)}
            className="btn-ghost border border-slate-700/50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <Link
            to={`/dashboard/analytics/${link.id}`}
            state={{ from: "/dashboard/links" }}
            className="btn-ghost border border-heart-rose/25 bg-brand-600/10 text-brand-300 hover:bg-heart-coral/15"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </Link>
          <button
            type="button"
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
