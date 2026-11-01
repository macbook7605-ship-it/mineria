import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { StageNotice } from '@/components/ui/StageNotice';
import { ESTADO_INSPECCION } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { getInspecciones, nombrePorId } from '@/services/dataService';
import { formatDate } from '@/utils/date';

export default function InspeccionesPage() {
  const { can } = useAuth();
  const { data, loading } = useAsync(getInspecciones);
  return (
    <>
      <PageHeader title="Inspecciones" back />
      <Page>
        {can('inspecciones.registrar') && (
          <>
            <Button block icon={Plus} disabled>
              NUEVA INSPECCIÓN
            </Button>
            <StageNotice etapa={5}>El registro de inspecciones con fotografías se habilita en la Etapa 5.</StageNotice>
          </>
        )}
        {loading || !data ? (
          <Loader />
        ) : (
          <div className="space-y-3">
            {data.map((r) => (
              <Card key={r.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">Inspección · {r.area}</p>
                    <p className="text-sm text-ink-2">
                      {formatDate(r.fecha)} · {nombrePorId(r.responsable_id)}
                    </p>
                  </div>
                  <Badge tone={ESTADO_INSPECCION[r.estado].tone}>{ESTADO_INSPECCION[r.estado].label}</Badge>
                </div>
                <dl className="grid gap-3 sm:grid-cols-3">
                  <Field label="Hallazgos">{r.hallazgos}</Field>
                  <Field label="Condiciones encontradas">{r.condiciones}</Field>
                  <Field label="Acciones correctivas">{r.acciones_correctivas}</Field>
                </dl>
              </Card>
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
