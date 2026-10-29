import { FileBarChart } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/ui/EmptyState';
import { StageNotice } from '@/components/ui/StageNotice';

export default function ReportesPage() {
  return (
    <>
      <PageHeader title="Reportes" back />
      <Page>
        <EmptyState icon={FileBarChart} title="Reportes" text="Aquí se consultarán los reportes de seguridad, personal, equipos y producción." />
        <StageNotice etapa={5}>Los reportes se construyen con los datos reales registrados a partir de la Etapa 2.</StageNotice>
      </Page>
    </>
  );
}
