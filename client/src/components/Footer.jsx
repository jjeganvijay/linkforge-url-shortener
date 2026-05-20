import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:text-left">
        <p className="flex items-center gap-1 text-sm text-slate-500">
          Made with <Heart className="h-3.5 w-3.5 fill-accent-coral text-accent-coral" /> for
          people who share links
        </p>
        <p className="text-xs text-slate-600">Secure · Fast · Your data stays yours</p>
      </div>
    </footer>
  );
}
