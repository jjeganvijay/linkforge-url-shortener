import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import CopyButton from '../../components/CopyButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useLinks } from '../../context/LinksContext';
import { useTheme } from '../../context/ThemeContext';
import { truncateUrl } from '../../utils/validators';

function downloadQr(svgEl, filename) {
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export default function QRCodesPage() {
  useDocumentTitle('QR codes');
  const { links, loading, error, refreshLinks } = useLinks();
  const { isDark } = useTheme();
  const qrBg = isDark ? '#2a1f3d' : '#faf5ff';
  const qrFg = isDark ? '#e2e8f0' : '#1e1b4b';

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="QR codes"
        subtitle="Scan-ready codes for every short link — download or copy the URL."
        backTo="/dashboard"
        backLabel="Back to dashboard"
      />

      {loading ? (
        <LoadingSpinner text="Loading QR codes..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={refreshLinks} />
      ) : links.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="No QR codes yet"
          description="Every short link gets a scannable QR code. Create a link first."
          actionLabel="Create a link"
          actionTo="/dashboard/create"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <div key={link.id} className="card flex flex-col items-center p-6 text-center">
              <QRCodeSVG
                id={`qr-${link.id}`}
                value={link.shortUrl}
                size={160}
                bgColor={qrBg}
                fgColor={qrFg}
                className="rounded-lg"
              />
              <p className="mt-4 w-full truncate text-sm font-semibold text-brand-300">{link.shortUrl}</p>
              <p className="mt-1 w-full text-xs text-muted">{truncateUrl(link.originalUrl, 40)}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <CopyButton text={link.shortUrl} label="Copy URL" />
                <button
                  type="button"
                  className="btn-ghost border border-white/10"
                  onClick={() => {
                    const el = document.getElementById(`qr-${link.id}`);
                    downloadQr(el, `qr-${link.customAlias || link.id}.png`);
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  PNG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
