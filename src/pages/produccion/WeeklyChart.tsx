import { useState } from 'react';
import type { ResumenDia } from '@/services/dataService';
import { formatDate, shortWeekday, toISODate } from '@/utils/date';
import { formatNumber, cx } from '@/utils/format';

/**
 * Barras de toneladas por día (una sola serie, sin leyenda: el título la nombra).
 * Se etiquetan solo hoy y el máximo; el resto se consulta tocando la barra.
 */
export function WeeklyChart({ dias }: { dias: ResumenDia[] }) {
  const hoy = toISODate();
  const max = Math.max(...dias.map((d) => d.toneladas), 1);
  const maxFecha = dias.find((d) => d.toneladas === max)?.fecha;
  const [sel, setSel] = useState<string | null>(null);
  const activo = dias.find((d) => d.fecha === sel);

  return (
    <div>
      <div className="mb-2 h-10 text-sm" aria-live="polite">
        {activo ? (
          <p>
            <span className="font-semibold">{formatDate(activo.fecha)}</span>
            <span className="text-ink-2">
              {' '}
              · {formatNumber(activo.toneladas)} t · {activo.viajes} viajes · {activo.horas} h
            </span>
          </p>
        ) : (
          <p className="text-ink-3">Toque una barra para ver el detalle del día.</p>
        )}
      </div>
      <div className="flex h-44 items-end gap-2 border-b border-line" role="list">
        {dias.map((d) => {
          const etiqueta = d.fecha === hoy || d.fecha === maxFecha;
          const h = d.toneladas ? Math.max((d.toneladas / max) * 100, 4) : 0;
          return (
            <button
              key={d.fecha}
              role="listitem"
              onClick={() => setSel(sel === d.fecha ? null : d.fecha)}
              onMouseEnter={() => setSel(d.fecha)}
              aria-label={`${formatDate(d.fecha)}: ${formatNumber(d.toneladas)} toneladas`}
              className="group flex h-full flex-1 flex-col items-center justify-end"
            >
              {etiqueta && d.toneladas > 0 && <span className="mb-1 text-xs font-semibold text-ink-2 tabular-nums">{formatNumber(d.toneladas)}</span>}
              <span
                className={cx(
                  'w-full max-w-10 rounded-t transition',
                  d.fecha === hoy ? 'bg-mina' : 'bg-mina/45',
                  sel === d.fecha && 'ring-2 ring-ink ring-offset-2 ring-offset-surface',
                )}
                style={{ height: `${h}%` }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {dias.map((d) => (
          <span key={d.fecha} className={cx('flex-1 text-center text-xs capitalize', d.fecha === hoy ? 'font-bold text-mina' : 'text-ink-3')}>
            {d.fecha === hoy ? 'Hoy' : shortWeekday(d.fecha)}
          </span>
        ))}
      </div>
    </div>
  );
}
