export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClass = size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeClass} animate-spin rounded-full border-2 border-slate-700 border-t-brand-500`}
      />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
}
