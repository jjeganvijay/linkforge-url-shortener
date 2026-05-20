import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  showBack = true,
  children,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="mb-8 animate-fade-in-up">
      {showBack && (
        <button
          type="button"
          onClick={handleBack}
          className="back-button mb-5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-muted leading-relaxed">{subtitle}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}
