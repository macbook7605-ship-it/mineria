import { Link } from 'react-router-dom';
import { ChevronRight, Gauge, Truck, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ESTADO_EQUIPO } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { getEquipos, nombrePorId } from '@/services/dataService';
import { formatNumber } from '@/utils/format';
import { FuelBar } from './FuelBar';

export default function EquiposPage() {
  const { data, loading } = useAsync(getEquipos);
  return (
    <>
      <PageHeader title="Equipos" subtitle="Estado de la flota" />
      <Page>
        {loading || !data ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              {(Object.keys(ESTADO_EQUIPO) as (keyof typeof ESTADO_EQUIPO)[]).map((k) => (
                <div key={k} className="rounded-xl border border-line bg-surface px-2 py-3">
                  <div className="text-2xl font-extrabold tabular-nums">{data.filter((e) => e.estado === k).length}</div>
                  <Badge tone={ESTADO_EQUIPO[k].tone} className="mt-1">
                    {ESTADO_EQUIPO[k].label}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.map((e) => {
                const est = ESTADO_EQUIPO[e.estado];
                return (
                  <Link key={e.id} to={`/equipos/${e.id}`} className="block space-y-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-ink-3">
                    <div className="flex items-start gap-3">
                      <div className="grid size-12 place-items-center rounded-xl bg-surface-2 text-mina">
                        <Truck className="size-6" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold">{e.nombre}</p>
                        <p className="text-sm text-ink-3">{e.codigo}</p>
                      </div>
                      <ChevronRight className="size-5 text-ink-3" aria-hidden />
                    </div>
                    <Badge tone={est.tone}>{est.label}</Badge>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-ink-2">
                        <User className="size-4" aria-hidden /> {nombrePorId(e.operador_id)}
                      </div>
                      <div className="flex items-center gap-2 text-ink-2">
                        <Gauge className="size-4" aria-hidden /> {formatNumber(e.horometro, 1)} h
                      </div>
                    </div>
                    <FuelBar value={e.combustible} />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </Page>
    </>
  );
}
