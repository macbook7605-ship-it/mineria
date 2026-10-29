import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { StageNotice } from '@/components/ui/StageNotice';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { getIperc, nombrePorId } from '@/services/dataService';
import { formatDate } from '@/utils/date';

export default function IpercPage() {
  const { can } = useAuth();
  const { data, loading } = useAsync(getIperc);
  return (
    <>
      <PageHeader title="IPERC" subtitle="Identificación de peligros y control de riesgos" back />
      <Page>
        {can('iperc.registrar') && (
          <>
            <Button block icon={Plus} disabled>
              NUEVO IPERC
            </Button>
            <StageNotice etapa={4}>El formulario de registro (con fotografía y confirmación) se habilita junto a las asignaciones y cambios de actividad.</StageNotice>
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
                    <p className="font-bold">{r.actividad}</p>
                    <p className="text-sm text-ink-2">
                      {formatDate(r.fecha)} · {r.hora} · {r.area}
                    </p>
                  </div>
                  {r.confirmado ? <Badge tone="ok">Confirmado</Badge> : <Badge tone="warn">Sin confirmar</Badge>}
                </div>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Peligro">{r.peligro}</Field>
                  <Field label="Riesgo">{r.riesgo}</Field>
                  <Field label="Medida de control">{r.medida_control}</Field>
                  <Field label="Responsable">{nombrePorId(r.responsable_id)}</Field>
                </dl>
              </Card>
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
