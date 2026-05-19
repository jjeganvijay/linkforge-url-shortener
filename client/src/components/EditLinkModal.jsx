import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { isValidUrl } from '../utils/validators';

export default function EditLinkModal({ link, open, onClose, onSave, saving }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (link) {
      setUrl(link.originalUrl || '');
      setError('');
    }
  }, [link, open]);

  if (!open || !link) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('URL is required');
      return;
    }
    if (!isValidUrl(url.trim())) {
      setError('Please enter a valid URL');
      return;
    }
    onSave(link.id, url.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit destination URL</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 truncate text-sm text-slate-400">Short: {link.shortUrl}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">New URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com/new-page"
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
