import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const LinksContext = createContext(null);

export function LinksProvider({ children }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshLinks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refreshLinks();
  }, [refreshLinks]);

  return (
    <LinksContext.Provider value={{ links, setLinks, loading, error, refreshLinks }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const ctx = useContext(LinksContext);
  if (!ctx) throw new Error('useLinks must be used within LinksProvider');
  return ctx;
}
