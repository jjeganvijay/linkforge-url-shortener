import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <div className="flex-1">
        <p className="text-sm text-red-300">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-400 underline hover:text-red-300"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
