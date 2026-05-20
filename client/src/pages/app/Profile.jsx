import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Settings, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import api from "../../api/axios";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/auth/me", { name, email });
      updateUser(res.data.data.user);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setEditing(false);
  };

  const initial = (user?.name || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Profile"
        subtitle="Your LinkForge account at a glance."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />

      <div className="card p-8 text-center">
        <span className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-heart-coral text-3xl font-bold text-white shadow-glow">
          {initial}
        </span>
        {!editing ? (
          <>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="mt-1 flex items-center justify-center gap-2 text-muted">
              <Mail className="h-4 w-4" />
              {user?.email}
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="your@email.com"
              />
            </div>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn-ghost border border-slate-700/50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className="card flex items-center gap-4 p-4">
          <User className="h-5 w-5 text-brand-400" />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-muted">
              Display name
            </p>
            <p className="font-medium text-white">{user?.name}</p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm text-brand-400 hover:text-brand-300"
            >
              Edit
            </button>
          )}
        </div>
        <Link
          to="/dashboard/settings"
          className="card-interactive flex items-center justify-between gap-4 p-4"
        >
          <div className="flex items-center gap-4">
            <Settings className="h-5 w-5 text-brand-400" />
            <div>
              <p className="font-medium text-white">Settings</p>
              <p className="text-sm text-muted">Theme and preferences</p>
            </div>
          </div>
          <span className="text-sm text-brand-300">Open →</span>
        </Link>
      </div>
    </div>
  );
}
