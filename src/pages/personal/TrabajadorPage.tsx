import { useParams } from 'react-router-dom';
import { AlertTriangle, ClipboardCheck, HardHat, MessageSquareText, UserX } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { Section } from '@/components/ui/Section';
import { ListRow } from '@/components/ui/ListRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActivityHistory } from '@/components/ui/ActivityHistory';
import { ESTADO_INCIDENTE, ESTADO_PERSONAL } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import {
  getHistorialTrabajador,
  getIncidentesTrabajador,
  getIpercTrabajador,
  getParticipacionesTrabajador,
  getPerfil,
} from '@/services/dataService';
import { formatDate, toISODate } from '@/utils/date';

export default function TrabajadorPage() {
  const { id = '' } = useParams();
  const { user, can } = useAuth();
  const propio = user?.id === id;
  const permitido = propio || can('personal.ver_todo');

  const { data, loading } = useAsync(async () => {
    if (!permitido) return null;
    const [perfil, historial, charlas, iperc, incidentes] = await Promise.all([
      getPerfil(id),
      getHistorialTrabajador(id),
      getParticipacionesTrabajador(id),
      getIpercTrabajador(id),
      getIncidentesTrabajador(id),
    ]);
    return { perfil, historial, charlas, iperc, incidentes };
  }, [id, permitido]);

  if (!permitido) return <EmptyState icon={UserX} title="Acceso restringido" text="Solo puede consultar su propio perfil." />;

  const hoy = toISODate();
  const actual = data?.historial.filter((a) => a.fecha === hoy).sort((a, b) => b.hora_inicio.localeCompare(a.hora_inicio))[0];

  return (
    <>
      <PageHeader title={propio ? 'Mi perfil' : 'Perfil del trabajador'} back={!propio || can('personal.ver_todo')} />
      <Page>
        {loading || !data ? (
          <Loader />
        ) : !data.perfil ? (
          <EmptyState icon={UserX} title="Trabajador no encontrado" />
        ) : (
          <>
            <Card className="flex items-center gap-4">
              <Avatar name={data.perfil.nombre} size="lg" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-extrabold">{data.perfil.nombre}</h2>
                <p className="text-sm text-ink-2">{data.perfil.cargo}</p>
                <Badge className="mt-2" tone={ESTADO_PERSONAL[data.perfil.estado].tone}>
                  {ESTADO_PERSONAL[data.perfil.estado].label}
                </Badge>
              </div>
            </Card>

            <Section title="Actividad actual">
              <Card className="flex items-center gap-3 border-mina/30">
                <HardHat className="size-8 shrink-0 text-mina" aria-hidden />
                {actual ? (
                  <div>
                    <p className="text-lg font-bold">{actual.actividad}</p>
                    <p className="text-sm text-ink-2">
                      {actual.area} · desde {actual.hora_inicio}
                    </p>
                  </div>
                ) : (
                  <p className="text-ink-2">Sin actividad asignada hoy.</p>
                )}
              </Card>
            </Section>

            <Section title="Historial de actividades">
              <ActivityHistory items={data.historial} />
            </Section>

            <div className="grid gap-6 lg:grid-cols-3">
              <Section title={`Charlas realizadas (${data.charlas.length})`}>
                <div className="space-y-2">
                  {data.charlas.length === 0 && <p className="text-sm text-ink-2">Ninguna registrada.</p>}
                  {data.charlas.map((c) => (
                    <ListRow key={c.id} icon={MessageSquareText} iconClass="text-info" title={c.charla?.titulo ?? '—'} subtitle={`${formatDate(c.fecha)} · ${c.hora}`} />
                  ))}
                </div>
              </Section>
              <Section title={`IPERC relacionados (${data.iperc.length})`}>
                <div className="space-y-2">
                  {data.iperc.length === 0 && <p className="text-sm text-ink-2">Ninguno registrado.</p>}
                  {data.iperc.map((i) => (
                    <ListRow key={i.id} to="/seguridad/iperc" icon={ClipboardCheck} title={i.actividad} subtitle={`${formatDate(i.fecha)} · ${i.hora} · ${i.area}`} />
                  ))}
                </div>
              </Section>
              <Section title={`Incidentes relacionados (${data.incidentes.length})`}>
                <div className="space-y-2">
                  {data.incidentes.length === 0 && <p className="text-sm text-ink-2">Ninguno registrado.</p>}
                  {data.incidentes.map((i) => (
                    <ListRow
                      key={i.id}
                      to="/seguridad/incidentes"
                      icon={AlertTriangle}
                      iconClass="text-danger"
                      title={i.tipo}
                      subtitle={formatDate(i.fecha)}
                      trailing={<Badge tone={ESTADO_INCIDENTE[i.estado].tone}>{ESTADO_INCIDENTE[i.estado].label}</Badge>}
                    />
                  ))}
                </div>
              </Section>
            </div>
          </>
        )}
      </Page>
    </>
  );
}
