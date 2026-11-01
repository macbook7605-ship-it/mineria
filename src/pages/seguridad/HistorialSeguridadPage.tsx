import { AlertOctagon, AlertTriangle, ClipboardCheck, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { ListRow } from '@/components/ui/ListRow';
import { Loader } from '@/components/ui/Loader';
import { useAsync } from '@/hooks/useAsync';
import { getHistorialSeguridad } from '@/services/dataService';
import { formatDate } from '@/utils/date';

const ICONOS = {
  IPERC: { icon: ClipboardCheck, cls: 'text-mina', to: 'iperc' },
  Incidente: { icon: AlertTriangle, cls: 'text-danger', to: 'incidentes' },
  'Inspección': { icon: Search, cls: 'text-ok', to: 'inspecciones' },
  'Condición insegura': { icon: AlertOctagon, cls: 'text-warn', to: 'condiciones' },
} as const;

export default function HistorialSeguridadPage() {
  const { data, loading } = useAsync(getHistorialSeguridad);
  return (
    <>
      <PageHeader title="Historial" subtitle="Todos los registros de seguridad" back />
      <Page>
        {loading || !data ? (
          <Loader />
        ) : (
          <div className="space-y-2">
            {data.map((r) => {
              const meta = ICONOS[r.tipo];
              return (
                <ListRow
                  key={`${r.tipo}-${r.id}`}
                  to={`/seguridad/${meta.to}`}
                  icon={meta.icon}
                  iconClass={meta.cls}
                  title={r.titulo}
                  subtitle={`${r.tipo} · ${r.area} · ${formatDate(r.fecha)}${r.hora ? ` ${r.hora}` : ''}`}
                />
              );
            })}
          </div>
        )}
      </Page>
    </>
  );
}
