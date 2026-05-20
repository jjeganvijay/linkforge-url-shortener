import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <div className="icon-circle-warm mb-4 flex h-16 w-16 items-center justify-center rounded-xl">
          <Icon className="h-8 w-8 text-brand-300" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6 inline-flex">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button type="button" onClick={onAction} className="btn-primary mt-6 inline-flex">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
