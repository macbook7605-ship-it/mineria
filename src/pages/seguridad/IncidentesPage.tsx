import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { StageNotice } from '@/components/ui/StageNotice';
import { ESTADO_INCIDENTE } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { getIncidentes, nombrePorId } from '@/services/dataService';
import { formatDate } from '@/utils/date';

export default function IncidentesPage() {
  const { data, loading } = useAsync(getIncidentes);
  return (
    <>
      <PageHeader title="Incidentes" back />
      <Page>
        <Button block variant="danger" icon={AlertTriangle} disabled>
          REPORTAR INCIDENTE
        </Button>
        <StageNotice etapa={5}>El formulario de reporte (con fotografía y seguimiento de estado) se habilita en la Etapa 5.</StageNotice>
        {loading || !data ? (
          <Loader />
        ) : (
          <div className="space-y-3">
            {data.map((r) => (
              <Card key={r.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{r.tipo}</p>
                    <p className="text-sm text-ink-2">
                      {formatDate(r.fecha)} · {r.hora} · {r.area}
                    </p>
                  </div>
                  <Badge tone={ESTADO_INCIDENTE[r.estado].tone}>{ESTADO_INCIDENTE[r.estado].label}</Badge>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field label="Descripción">{r.descripcion}</Field>
                  <Field label="Persona involucrada">{nombrePorId(r.persona_id)}</Field>
                  <Field label="Medidas tomadas">{r.medidas}</Field>
                </dl>
              </Card>
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
