import { Sparkles } from 'lucide-react';

export default function PendingUrlBanner({ url }) {
  if (!url) return null;

  return (
    <div className="info-banner mb-6 flex gap-3 p-4">
      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
      <div>
        <p className="text-sm font-medium text-white">Your URL is ready to shorten</p>
        <p className="mt-1 break-all text-xs text-muted">{url}</p>
      </div>
    </div>
  );
}
