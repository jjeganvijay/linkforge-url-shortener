import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { resolvePendingUrl, CREATE_LINK_PATH } from '../utils/pendingUrl';
import { useLocation, useNavigate } from 'react-router-dom';

const getGoogleClientId = () => {
  const value = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export default function GoogleSignInButton({ label = 'Continue with Google' }) {
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const clientId = useMemo(() => getGoogleClientId(), []);

  useEffect(() => {
    if (!clientId) return;
    const google = window.google;
    if (!google?.accounts?.id) return;
    if (!containerRef.current) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await loginWithGoogle(response.credential);
          toast.success('Signed in with Google');

          const pendingUrl = resolvePendingUrl(location.state);
          if (pendingUrl) {
            navigate(CREATE_LINK_PATH, { state: { pendingUrl } });
            return;
          }
          navigate('/dashboard', { replace: true });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Google sign-in failed');
        }
      },
    });

    containerRef.current.innerHTML = '';
    google.accounts.id.renderButton(containerRef.current, {
      theme: 'outline',
      size: 'large',
      text: label === 'Continue with Google' ? 'continue_with' : 'signin_with',
      shape: 'pill',
      width: 360,
    });

    setReady(true);
  }, [clientId, label, location.state, loginWithGoogle, navigate]);

  if (!clientId) return null;

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="flex justify-center" />
      {!ready && (
        <p className="text-center text-xs text-slate-500">
          Loading Google sign-in…
        </p>
      )}
    </div>
  );
}

