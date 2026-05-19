import { useState, useEffect } from 'react';
import { Link2, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import LinkCard from '../components/LinkCard';
import EditLinkModal from '../components/EditLinkModal';
import BulkUpload from '../components/BulkUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { isValidUrl } from '../utils/validators';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/links');
      setLinks(res.data.data.links);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!url.trim()) errors.url = 'URL is required';
    else if (!isValidUrl(url.trim())) errors.url = 'Please enter a valid URL';
    if (customAlias && !/^[a-zA-Z0-9-_]{3,20}$/.test(customAlias)) {
      errors.customAlias = 'Alias must be 3-20 chars (letters, numbers, -, _)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCreating(true);
    try {
      const payload = { url: url.trim() };
      if (customAlias) payload.customAlias = customAlias;
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

      const res = await api.post('/links', payload);
      setLinks((prev) => [res.data.data.link, ...prev]);
      setUrl('');
      setCustomAlias('');
      setExpiresAt('');
      toast.success('Short link created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link');
    } finally {
      setCreating(false);
    }
  };

  const handleEditSave = async (id, newUrl) => {
    setSavingEdit(true);
    try {
      const res = await api.patch(`/links/${id}`, { url: newUrl });
      setLinks((prev) => prev.map((l) => (l.id === id ? res.data.data.link : l)));
      setEditingLink(null);
      toast.success('Link updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update link');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success('Link deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete link');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-slate-400">Create and manage your short links</p>
        </div>

        <div className="card mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-brand-500" />
            <h2 className="text-lg font-semibold text-white">Create Short Link</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Long URL *
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field"
                placeholder="https://example.com/very-long-url"
              />
              {formErrors.url && <p className="mt-1 text-xs text-red-400">{formErrors.url}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  Custom Alias
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </label>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="input-field"
                  placeholder="my-link"
                />
                {formErrors.customAlias && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.customAlias}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Expiry Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" disabled={creating} className="btn-primary">
              <Link2 className="h-4 w-4" />
              {creating ? 'Creating...' : 'Shorten URL'}
            </button>
          </form>
        </div>

        <div className="mb-8">
          <BulkUpload
            onCreated={(created) => setLinks((prev) => [...created, ...prev])}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Your Links {links.length > 0 && `(${links.length})`}
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading your links..." />
          ) : error ? (
            <ErrorAlert message={error} onRetry={fetchLinks} />
          ) : links.length === 0 ? (
            <div className="card py-12 text-center">
              <Link2 className="mx-auto h-12 w-12 text-slate-600" />
              <p className="mt-4 text-slate-400">No links yet. Create your first short URL above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onEdit={setEditingLink}
                  onDelete={handleDelete}
                  deleting={deletingId === link.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <EditLinkModal
        link={editingLink}
        open={Boolean(editingLink)}
        onClose={() => setEditingLink(null)}
        onSave={handleEditSave}
        saving={savingEdit}
      />
    </div>
  );
}
