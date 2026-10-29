import { CheckCircle2, CheckSquare, Clock, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Section } from '@/components/ui/Section';
import { ListRow } from '@/components/ui/ListRow';
import { Avatar } from '@/components/ui/Avatar';
import { StageNotice } from '@/components/ui/StageNotice';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { getCharlaDelDia, nombrePorId } from '@/services/dataService';
import { formatDate } from '@/utils/date';

export default function CharlasPage() {
  const { user, can } = useAuth();
  const { data, loading } = useAsync(getCharlaDelDia);

  return (
    <>
      <PageHeader title="Charlas" subtitle="Charla de seguridad del día" back />
      <Page>
        {loading || !data ? (
          <Loader />
        ) : !data.charla ? (
          <Card className="text-center text-ink-2">No se ha definido la charla del día.</Card>
        ) : (
          <>
            <Card className="space-y-4 border-mina/40 bg-gradient-to-br from-mina/10 to-surface">
              <p className="text-xs font-bold tracking-widest text-mina uppercase">Charla del día · {formatDate(data.fecha)}</p>
              <div>
                <h2 className="text-2xl leading-tight font-extrabold">{data.charla.titulo}</h2>
                <p className="mt-1 text-sm text-ink-2">
                  {data.charla.categoria} · {data.charla.descripcion}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="secondary" icon={FileText} disabled>
                  ABRIR PDF
                </Button>
                {user?.rol === 'trabajador' &&
                  (data.confirmados.some((c) => c.trabajador_id === user.id) ? (
                    <div className="flex min-h-13 items-center justify-center gap-2 rounded-xl bg-ok/15 font-bold text-ok">
                      <CheckCircle2 className="size-5" /> CONFIRMADO
                    </div>
                  ) : (
                    <Button icon={CheckSquare} disabled>
                      HE LEÍDO Y COMPRENDIDO
                    </Button>
                  ))}
              </div>
            </Card>
            <StageNotice etapa={3}>La apertura del PDF y la confirmación de lectura se habilitan con la biblioteca de charlas.</StageNotice>

            {can('charlas.ver_participacion') && (
              <>
                <Section title={`Confirmados (${data.confirmados.length})`}>
                  <div className="space-y-2">
                    {data.confirmados.map((c) => (
                      <ListRow
                        key={c.id}
                        leading={<Avatar name={nombrePorId(c.trabajador_id)} />}
                        title={nombrePorId(c.trabajador_id)}
                        subtitle={`${formatDate(c.fecha)} · ${c.hora}`}
                        trailing={<CheckCircle2 className="size-6 text-ok" aria-label="Confirmado" />}
                      />
                    ))}
                  </div>
                </Section>
                <Section title={`Pendientes (${data.pendientes.length})`}>
                  <div className="space-y-2">
                    {data.pendientes.map((p) => (
                      <ListRow
                        key={p.id}
                        leading={<Avatar name={p.nombre} />}
                        title={p.nombre}
                        subtitle={p.cargo}
                        trailing={<Clock className="size-6 text-warn" aria-label="Pendiente" />}
                      />
                    ))}
                  </div>
                </Section>
              </>
            )}
          </>
        )}
      </Page>
    </>
  );
}
