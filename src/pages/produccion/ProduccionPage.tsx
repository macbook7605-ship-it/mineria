import { Clock, Package, Plus, Route, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Section } from '@/components/ui/Section';
import { StatCard } from '@/components/ui/StatCard';
import { StageNotice } from '@/components/ui/StageNotice';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { equipoPorId, getProduccion, getResumenProduccion } from '@/services/dataService';
import { formatDate, shiftLabel, toISODate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { WeeklyChart } from './WeeklyChart';

export default function ProduccionPage() {
  const { can } = useAuth();
  const { data, loading } = useAsync(async () => {
    const [semana, registros] = await Promise.all([getResumenProduccion(7), getProduccion()]);
    return { semana, registros };
  });

  const hoy = toISODate();
  const dia = data?.semana.find((d) => d.fecha === hoy);
  const tot = data?.semana.reduce((s, d) => ({ t: s.t + d.toneladas, v: s.v + d.viajes, h: s.h + d.horas }), { t: 0, v: 0, h: 0 });

  return (
    <>
      <PageHeader title="Producción" subtitle="Últimos 7 días" />
      <Page>
        {can('produccion.registrar') && (
          <>
            <Button block icon={Plus} disabled>
              REGISTRAR PRODUCCIÓN
            </Button>
            <StageNotice etapa={2}>El registro de producción se habilita al conectar la base de datos.</StageNotice>
          </>
        )}
        {loading || !data || !tot ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard icon={Package} label="Producción diaria" value={formatNumber(dia?.toneladas ?? 0)} detail="toneladas hoy" />
              <StatCard icon={TrendingUp} label="Producción semanal" value={formatNumber(tot.t)} detail="toneladas (7 días)" />
              <StatCard icon={Route} label="Número de viajes" value={formatNumber(tot.v)} detail={`${dia?.viajes ?? 0} hoy`} tone="info" />
              <StatCard icon={Clock} label="Horas trabajadas" value={formatNumber(tot.h)} detail={`${dia?.horas ?? 0} h hoy`} tone="info" />
            </div>

            <Section title="Toneladas por día">
              <Card>
                <WeeklyChart dias={data.semana} />
              </Card>
            </Section>

            <Section title="Registros">
              <div className="space-y-2">
                {data.registros.map((r) => (
                  <Card key={r.id} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">
                        {r.material} · {formatNumber(r.toneladas)} t
                      </p>
                      <p className="truncate text-sm text-ink-2">
                        {formatDate(r.fecha)} · Turno {shiftLabel(r.turno)} · {equipoPorId(r.equipo_id)?.codigo ?? '—'}
                      </p>
                      {r.observaciones && <p className="text-xs text-ink-3">{r.observaciones}</p>}
                    </div>
                    <div className="text-right text-sm text-ink-2 tabular-nums">
                      <div>{r.viajes} viajes</div>
                      <div>{r.horas} h</div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </>
        )}
      </Page>
    </>
  );
}
