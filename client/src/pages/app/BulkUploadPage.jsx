import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import BulkUpload from '../../components/BulkUpload';
import { useLinks } from '../../context/LinksContext';

export default function BulkUploadPage() {
  const { setLinks } = useLinks();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Bulk upload"
        subtitle="Import up to 50 URLs at once from CSV — perfect for campaigns and batch sharing."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="icon-circle-warm h-14 w-14 rounded-xl">
          <Upload className="h-7 w-7 text-brand-300" />
        </div>
        <p className="text-sm text-muted">
          Format: one URL per line, or <code className="text-brand-400">url,alias</code> per line.
        </p>
      </div>

      <BulkUpload
        onCreated={(created) => {
          setLinks((prev) => [...created, ...prev]);
          if (created[0]) {
            navigate('/dashboard/links', { state: { highlightId: created[0].id } });
          }
        }}
      />
    </div>
  );
}
