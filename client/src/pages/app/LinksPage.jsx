import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, Plus, Search, ArrowUpDown } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHeader from '../../components/PageHeader';
import LinkCard from '../../components/LinkCard';
import EditLinkModal from '../../components/EditLinkModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useLinks } from '../../context/LinksContext';
import { useLinkActions } from '../../hooks/useLinkActions';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'clicks', label: 'Most clicks' },
];

export default function LinksPage() {
  useDocumentTitle('My links');
  const location = useLocation();
  const { links, loading, error, refreshLinks } = useLinks();
  const {
    deletingId,
    editingLink,
    setEditingLink,
    savingEdit,
    togglingId,
    saveEdit,
    deleteLink,
    confirmDeleteLink,
    toggleLinkActive,
  } = useLinkActions();
  const [highlightedId, setHighlightedId] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [pendingDelete, setPendingDelete] = useState(null);
  const highlightedCardRef = useRef(null);

  useEffect(() => {
    const id = location.state?.highlightId;
    if (id) {
      setHighlightedId(id);
      const t = window.setTimeout(() => setHighlightedId(null), 5000);
      requestAnimationFrame(() => {
        highlightedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...links];
    if (q) {
      list = list.filter(
        (l) =>
          l.shortUrl?.toLowerCase().includes(q) ||
          l.originalUrl?.toLowerCase().includes(q) ||
          l.customAlias?.toLowerCase().includes(q)
      );
    }
    if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'clicks') {
      list.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    }
    return list;
  }, [links, query, sort]);

  const handleDeleteClick = async (id) => {
    const result = await deleteLink(id);
    if (result?.needsConfirm) {
      setPendingDelete(id);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await confirmDeleteLink(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="My links"
        subtitle="Search, sort, and manage every short link in your workspace."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      >
        <Link to="/dashboard/create" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          New link
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingSpinner text="Loading your links..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={refreshLinks} />
      ) : links.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No links yet"
          description="Create your first short link to start tracking clicks and sharing QR codes."
          actionLabel="Create your first link"
          actionTo="/dashboard/create"
        />
      ) : (
        <>
          <div className="toolbar mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by URL or alias…"
                className="input-field pl-10"
                aria-label="Search links"
              />
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field min-w-[10rem]"
                aria-label="Sort links"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mb-4 text-sm text-muted">
            {filtered.length} of {links.length} link{links.length !== 1 ? 's' : ''}
            {query.trim() ? ` matching “${query.trim()}”` : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="card py-12 text-center text-muted">
              No links match your search. Try a different term.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onEdit={setEditingLink}
                  onDelete={handleDeleteClick}
                  onToggleActive={toggleLinkActive}
                  deleting={deletingId === link.id}
                  toggling={togglingId === link.id}
                  highlight={link.id === highlightedId}
                  innerRef={link.id === highlightedId ? highlightedCardRef : undefined}
                />
              ))}
            </div>
          )}
        </>
      )}

      <EditLinkModal
        link={editingLink}
        open={Boolean(editingLink)}
        onClose={() => setEditingLink(null)}
        onSave={saveEdit}
        saving={savingEdit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this link?"
        message="This permanently removes the short link and its analytics. This cannot be undone."
        confirmLabel="Delete link"
        loading={Boolean(deletingId)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
