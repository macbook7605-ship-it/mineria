import { Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { ListRow } from '@/components/ui/ListRow';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Section } from '@/components/ui/Section';
import { StageNotice } from '@/components/ui/StageNotice';
import { ESTADO_PERSONAL } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { actividadesActuales, getTrabajadores } from '@/services/dataService';
import { currentShift, formatDate, shiftLabel, toISODate } from '@/utils/date';

export default function PersonalPage() {
  const { user, can } = useAuth();
  const { data, loading } = useAsync(getTrabajadores);

  // El trabajador solo consulta su propio perfil.
  if (user && !can('personal.ver_todo')) return <Navigate to={`/personal/${user.id}`} replace />;

  const actuales = actividadesActuales();

  return (
    <>
      <PageHeader title="Personal" subtitle={`Asignación del día · ${formatDate(toISODate())} · Turno ${shiftLabel(currentShift())}`} />
      <Page>
        {can('asignaciones.crear') && (
          <>
            <Button block icon={Plus} disabled>
              NUEVA ASIGNACIÓN
            </Button>
            <StageNotice etapa={4}>Las asignaciones y cambios de actividad (con advertencia de IPERC) se habilitan en la Etapa 4.</StageNotice>
          </>
        )}
        <Section title="Trabajadores">
          {loading || !data ? (
            <Loader />
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {data.map((t) => {
                const act = actuales.get(t.id);
                return (
                  <ListRow
                    key={t.id}
                    to={`/personal/${t.id}`}
                    leading={<Avatar name={t.nombre} />}
                    title={t.nombre}
                    subtitle={act ? `${act.actividad} · ${act.area}` : t.cargo}
                    trailing={<Badge tone={ESTADO_PERSONAL[t.estado].tone}>{ESTADO_PERSONAL[t.estado].label}</Badge>}
                  />
                );
              })}
            </div>
          )}
        </Section>
      </Page>
    </>
  );
}
