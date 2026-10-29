import { AlertTriangle, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { StageNotice } from '@/components/ui/StageNotice';
import { ESTADO_CONDICION } from '@/components/ui/status';
import { useAsync } from '@/hooks/useAsync';
import { getCondiciones, nombrePorId } from '@/services/dataService';
import { formatDate } from '@/utils/date';

export default function CondicionesPage() {
  const { data, loading } = useAsync(getCondiciones);
  return (
    <>
      <PageHeader title="Condiciones inseguras" back />
      <Page>
        <Button block icon={AlertTriangle} disabled>
          REPORTAR CONDICIÓN INSEGURA
        </Button>
        <StageNotice etapa={5}>El reporte con fotografía, fecha y hora automáticas se habilita en la Etapa 5.</StageNotice>
        {loading || !data ? (
          <Loader />
        ) : (
          <div className="space-y-3">
            {data.map((r) => (
              <Card key={r.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{r.descripcion}</p>
                  <Badge tone={ESTADO_CONDICION[r.estado].tone}>{ESTADO_CONDICION[r.estado].label}</Badge>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-ink-2">
                  <MapPin className="size-4" aria-hidden /> {r.area} · {formatDate(r.fecha)} {r.hora}
                </p>
                <p className="text-sm text-ink-3">Reportado por {nombrePorId(r.responsable_id)}</p>
              </Card>
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
