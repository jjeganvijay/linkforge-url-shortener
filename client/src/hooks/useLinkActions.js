import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { isValidUrl } from '../utils/validators';
import { useLinks } from '../context/LinksContext';

export function useLinkActions() {
  const { links, setLinks } = useLinks();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const celebrateNewLink = useCallback(
    (link) => {
      toast.success('Short link created!', { duration: 4000 });
      navigate('/dashboard/links', { state: { highlightId: link.id } });
    },
    [navigate]
  );

  const createLink = async ({ url, customAlias, expiresAt }) => {
    const errors = {};
    if (!url?.trim()) errors.url = 'URL is required';
    else if (!isValidUrl(url.trim())) errors.url = 'Please enter a valid URL';
    if (customAlias && !/^[a-zA-Z0-9-_]{3,20}$/.test(customAlias)) {
      errors.customAlias = 'Alias must be 3-20 chars (letters, numbers, -, _)';
    }
    if (Object.keys(errors).length) return { ok: false, errors };

    setCreating(true);
    try {
      const payload = { url: url.trim() };
      if (customAlias) payload.customAlias = customAlias;
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

      const res = await api.post('/links', payload);
      const newLink = res.data.data.link;
      setLinks((prev) => [newLink, ...prev]);
      celebrateNewLink(newLink);
      return { ok: true, link: newLink };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link');
      return { ok: false };
    } finally {
      setCreating(false);
    }
  };

  const saveEdit = async (id, newUrl) => {
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

  const deleteLink = async (id, { skipConfirm = false } = {}) => {
    if (!skipConfirm) return { needsConfirm: true, id };
    setDeletingId(id);
    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success('Link deleted');
      return { ok: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete link');
      return { ok: false };
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteLink = async (id) => deleteLink(id, { skipConfirm: true });

  const toggleLinkActive = async (id, currentState) => {
    setTogglingId(id);
    try {
      const res = await api.patch(`/links/${id}`, { isActive: !currentState });
      setLinks((prev) => prev.map((l) => (l.id === id ? res.data.data.link : l)));
      toast.success(`Link ${currentState ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update link state');
    } finally {
      setTogglingId(null);
    }
  };

  return {
    links,
    creating,
    deletingId,
    editingLink,
    setEditingLink,
    savingEdit,
    togglingId,
    createLink,
    saveEdit,
    deleteLink,
    confirmDeleteLink,
    toggleLinkActive,
  };
}
