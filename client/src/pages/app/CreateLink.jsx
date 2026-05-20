import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Link2, Plus, Sparkles, Check, X, Loader } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import PendingUrlBanner from "../../components/PendingUrlBanner";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { resolvePendingUrl, clearPendingUrl } from "../../utils/pendingUrl";
import { useLinkActions } from "../../hooks/useLinkActions";
import api from "../../api/axios";

export default function CreateLink() {
  useDocumentTitle("Create link");
  const location = useLocation();
  const { creating, createLink } = useLinkActions();
  const [url, setUrl] = useState("");
  const [prefilledFromLanding, setPrefilledFromLanding] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [aliasCheckLoading, setAliasCheckLoading] = useState(false);
  const [aliasCheckResult, setAliasCheckResult] = useState(null); // null | 'available' | 'taken'
  const aliasCheckTimeoutRef = useRef(null);

  useEffect(() => {
    const pending = resolvePendingUrl(location.state);
    if (pending) {
      setUrl(pending);
      setPrefilledFromLanding(true);
      clearPendingUrl();
    }
  }, [location.state]);

  // Debounced alias availability check
  useEffect(() => {
    if (!customAlias.trim()) {
      setAliasCheckResult(null);
      return;
    }

    // Clear previous timeout
    if (aliasCheckTimeoutRef.current) {
      clearTimeout(aliasCheckTimeoutRef.current);
    }

    setAliasCheckLoading(true);
    aliasCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await api.get(`/links/check-alias/${customAlias}`);
        setAliasCheckResult(response.data.available ? "available" : "taken");
      } catch (err) {
        setAliasCheckResult("taken");
      } finally {
        setAliasCheckLoading(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (aliasCheckTimeoutRef.current) {
        clearTimeout(aliasCheckTimeoutRef.current);
      }
    };
  }, [customAlias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createLink({ url, customAlias, expiresAt });
    if (result.ok) {
      setUrl("");
      setCustomAlias("");
      setExpiresAt("");
      setFormErrors({});
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Create a short link"
        subtitle="Paste a long URL, optionally set a custom alias or expiry, and share in seconds."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />

      <PendingUrlBanner url={prefilledFromLanding ? url : null} />

      <div className="card-interactive animate-fade-in-up p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="icon-circle-warm h-14 w-14 rounded-xl">
            <Plus className="h-7 w-7 text-brand-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">New short link</h2>
            <p className="text-sm text-muted">
              Your link will appear in My links after creation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Long URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field text-base"
              placeholder="https://example.com/very-long-url"
            />
            {formErrors.url && (
              <p className="mt-1 text-xs text-red-400">{formErrors.url}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                Custom alias
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="input-field pr-10"
                  placeholder="my-link"
                />
                {customAlias && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {aliasCheckLoading ? (
                      <Loader className="h-4 w-4 animate-spin text-slate-400" />
                    ) : aliasCheckResult === "available" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : aliasCheckResult === "taken" ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {aliasCheckResult === "taken" && (
                <p className="mt-1 text-xs text-red-400">
                  This alias is already taken
                </p>
              )}
              {aliasCheckResult === "available" && (
                <p className="mt-1 text-xs text-green-400">
                  Alias is available!
                </p>
              )}
              {formErrors.customAlias && (
                <p className="mt-1 text-xs text-red-400">
                  {formErrors.customAlias}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Expiry (optional)
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="btn-primary w-full sm:w-auto"
          >
            <Link2 className="h-4 w-4" />
            {creating ? "Creating..." : "Shorten URL"}
          </button>
        </form>
      </div>
    </div>
  );
}
