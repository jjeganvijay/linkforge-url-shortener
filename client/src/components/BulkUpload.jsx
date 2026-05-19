import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function BulkUpload({ onCreated }) {
  const [csv, setCsv] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csv.trim()) {
      toast.error('Paste CSV content first');
      return;
    }
    setUploading(true);
    setResult(null);
    try {
      const res = await api.post('/links/bulk', { csv });
      const { created, failed, summary } = res.data.data;
      setResult({ created, failed, summary });
      if (created.length > 0) onCreated(created);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-brand-500" />
        <h2 className="text-lg font-semibold text-white">Bulk upload (CSV)</h2>
      </div>
      <p className="mb-3 text-sm text-slate-400">
        One URL per line. Optional alias: <code className="text-brand-400">url,alias</code> (max 50 lines)
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          className="input-field min-h-[120px] font-mono text-xs"
          placeholder={'https://example.com/page1\nhttps://example.com/page2,my-alias'}
        />
        <button type="submit" disabled={uploading} className="btn-primary">
          <FileText className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>
      {result && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300">
          <p>
            Success: {result.summary.success} / {result.summary.total}
            {result.failed.length > 0 && ` (${result.failed.length} failed)`}
          </p>
        </div>
      )}
    </div>
  );
}
