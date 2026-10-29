import type { HistorialActividad } from '@/database/types';
import { formatDate, toISODate } from '@/utils/date';

/** Tabla Hora | Actividad | Área. Los cambios se agregan; nunca se borra la actividad anterior. */
export function ActivityHistory({ items }: { items: HistorialActividad[] }) {
  if (!items.length) return <p className="text-sm text-ink-2">Sin actividades registradas.</p>;

  const hoy = toISODate();
  const porFecha = new Map<string, HistorialActividad[]>();
  [...items]
    .sort((a, b) => (b.fecha === a.fecha ? a.hora_inicio.localeCompare(b.hora_inicio) : b.fecha.localeCompare(a.fecha)))
    .forEach((a) => porFecha.set(a.fecha, [...(porFecha.get(a.fecha) ?? []), a]));

  return (
    <div className="space-y-4">
      {[...porFecha].map(([fecha, acts]) => (
        <div key={fecha} className="overflow-hidden rounded-2xl border border-line">
          <div className="bg-surface-2 px-4 py-2 text-xs font-bold tracking-wide text-ink-2 uppercase">{formatDate(fecha)}</div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-ink-3">
              <tr>
                <th className="px-4 py-2 font-semibold">Hora</th>
                <th className="px-2 py-2 font-semibold">Actividad</th>
                <th className="px-4 py-2 font-semibold">Área</th>
              </tr>
            </thead>
            <tbody>
              {acts.map((a, i) => {
                const actual = fecha === hoy && i === acts.length - 1;
                return (
                  <tr key={a.id} className="border-t border-line bg-surface">
                    <td className="px-4 py-3 font-semibold tabular-nums">{a.hora_inicio}</td>
                    <td className="px-2 py-3">
                      <span className={actual ? 'font-semibold text-ink' : 'text-ink-2'}>{a.actividad}</span>
                      {actual && <span className="ml-2 rounded bg-mina/15 px-1.5 py-0.5 text-[10px] font-bold text-mina uppercase">Actual</span>}
                      {a.observaciones && <div className="text-xs text-ink-3">{a.observaciones}</div>}
                    </td>
                    <td className="px-4 py-3 text-ink-2">{a.area}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
