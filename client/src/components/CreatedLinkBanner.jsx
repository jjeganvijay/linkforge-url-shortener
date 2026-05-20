import { CheckCircle2, X, ArrowDown } from 'lucide-react';
import CopyButton from './CopyButton';

export default function CreatedLinkBanner({ link, onDismiss, onViewInList }) {
  if (!link) return null;

  return (
    <div role="alert" className="success-banner">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/30 to-heart-coral/30">
          <CheckCircle2 className="h-6 w-6 text-heart-rose" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-heart-blush">Nice — your link is live!</p>
          <p className="mt-1 text-sm text-muted">
            Copy it, share it, or jump to it in your list below.
          </p>
          <p className="mt-3 break-all font-mono text-lg font-semibold text-brand-300">
            {link.shortUrl}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CopyButton text={link.shortUrl} label="Copy short link" />
            <button
              type="button"
              onClick={onViewInList}
              className="inline-flex items-center gap-1.5 rounded-lg border border-heart-rose/40 bg-heart-coral/10 px-3 py-1.5 text-xs font-medium text-brand-300 transition hover:bg-heart-coral/20"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Jump to link in list
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-heart-coral/10 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
