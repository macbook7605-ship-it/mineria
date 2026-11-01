import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/** Encabezado fijo de página. Con `back` muestra botón de regreso. */
export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: boolean; action?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line bg-base/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center gap-2 px-4">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="-ml-2 grid size-12 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 hover:text-ink"
            aria-label="Volver"
          >
            <ArrowLeft className="size-6" />
          </button>
        )}
        <div className="min-w-0 flex-1 py-2">
          <h1 className="truncate text-xl font-extrabold">{title}</h1>
          {subtitle && <p className="truncate text-sm text-ink-2">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
