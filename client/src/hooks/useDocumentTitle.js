import { useEffect } from 'react';

const BASE = 'LinkForge';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · ${BASE}` : `${BASE} — URL Shortener`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
