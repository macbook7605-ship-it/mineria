import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { StageNotice } from '@/components/ui/StageNotice';
import { OPERACION } from '@/config/operacion';

const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;

export default function ConfiguracionPage() {
  return (
    <>
      <PageHeader title="Configuración" back />
      <Page>
        <Card>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label="Turno día">
              {hh(OPERACION.turnoDia.inicio)} – {hh(OPERACION.turnoDia.fin)}
            </Field>
            <Field label="Turno noche">
              {hh(OPERACION.turnoDia.fin)} – {hh(OPERACION.turnoDia.inicio)}
            </Field>
            <Field label="Áreas">{OPERACION.areas.join(', ')}</Field>
          </dl>
        </Card>
        <StageNotice etapa={2}>La edición de estos parámetros se habilita al conectar la base de datos.</StageNotice>
      </Page>
    </>
  );
}
