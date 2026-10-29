import { useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, Truck, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Field } from '@/components/ui/Field';
import { Loader } from '@/components/ui/Loader';
import { Section } from '@/components/ui/Section';
import { ListRow } from '@/components/ui/ListRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { StageNotice } from '@/components/ui/StageNotice';
import { ESTADO_EQUIPO } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { getEquipo, getEventosEquipo, getFallasEquipo, nombrePorId } from '@/services/dataService';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { FuelBar } from './FuelBar';

export default function EquipoDetallePage() {
  const { id = '' } = useParams();
  const { can } = useAuth();
  const { data, loading } = useAsync(
    async () => {
      const [equipo, fallas, eventos] = await Promise.all([getEquipo(id), getFallasEquipo(id), getEventosEquipo(id)]);
      return { equipo, fallas, eventos };
    },
    [id],
  );

  const e = data?.equipo;
  const restante = e ? e.proximo_mantenimiento - e.horometro : 0;

  return (
    <>
      <PageHeader title={e?.nombre ?? 'Equipo'} subtitle={e?.codigo} back />
      <Page>
        {loading || !data ? (
          <Loader />
        ) : !e ? (
          <EmptyState icon={Truck} title="Equipo no encontrado" />
        ) : (
          <>
            <Card className="space-y-4">
              <Badge tone={ESTADO_EQUIPO[e.estado].tone}>{ESTADO_EQUIPO[e.estado].label}</Badge>
              <dl className="grid grid-cols-2 gap-4">
                <Field label="Operador actual">{nombrePorId(e.operador_id)}</Field>
                <Field label="Horómetro">{formatNumber(e.horometro, 1)} h</Field>
                <Field label="Tipo">{e.tipo}</Field>
                <Field label="Código">{e.codigo}</Field>
              </dl>
              <div>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-ink-3 uppercase">Combustible</p>
                <FuelBar value={e.combustible} />
              </div>
            </Card>

            <Section title="Mantenimiento">
              <Card className="flex items-center gap-3">
                <Wrench className={restante <= 50 ? 'size-7 text-warn' : 'size-7 text-ok'} aria-hidden />
                <div>
                  <p className="font-bold">Próximo a las {formatNumber(e.proximo_mantenimiento)} h</p>
                  <p className="text-sm text-ink-2">
                    {restante > 0 ? `Faltan ${formatNumber(restante, 1)} h de operación` : `Vencido hace ${formatNumber(-restante, 1)} h`}
                  </p>
                </div>
              </Card>
            </Section>

            <Section title={`Fallas (${data.fallas.length})`}>
              <div className="space-y-2">
                {data.fallas.length === 0 && <p className="text-sm text-ink-2">Sin fallas registradas.</p>}
                {data.fallas.map((f) => (
                  <ListRow
                    key={f.id}
                    icon={f.resuelta ? CheckCircle2 : AlertTriangle}
                    iconClass={f.resuelta ? 'text-ok' : 'text-danger'}
                    title={f.descripcion}
                    subtitle={formatDate(f.fecha)}
                    trailing={<Badge tone={f.resuelta ? 'ok' : 'danger'}>{f.resuelta ? 'Resuelta' : 'Pendiente'}</Badge>}
                  />
                ))}
              </div>
            </Section>

            <Section title="Historial">
              <div className="space-y-2">
                {data.eventos.map((ev) => (
                  <ListRow key={ev.id} icon={Clock} iconClass="text-ink-3" title={ev.descripcion} subtitle={`${formatDate(ev.fecha)} · ${ev.hora}`} />
                ))}
              </div>
            </Section>

            {can('equipos.administrar') && (
              <StageNotice etapa={2}>El cambio de estado, registro de fallas, horómetro y combustible se habilita al conectar la base de datos.</StageNotice>
            )}
          </>
        )}
      </Page>
    </>
  );
}
