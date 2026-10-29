import { Link } from 'react-router-dom';
import { AlertOctagon, AlertTriangle, ClipboardCheck, History, MessageSquareText, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { cx } from '@/utils/format';

const MODULOS = [
  { to: 'iperc', label: 'IPERC', icon: ClipboardCheck, color: 'text-mina' },
  { to: 'charlas', label: 'Charlas', icon: MessageSquareText, color: 'text-info' },
  { to: 'incidentes', label: 'Incidentes', icon: AlertTriangle, color: 'text-danger' },
  { to: 'inspecciones', label: 'Inspecciones', icon: Search, color: 'text-ok' },
  { to: 'condiciones', label: 'Condiciones inseguras', icon: AlertOctagon, color: 'text-warn' },
  { to: 'historial', label: 'Historial', icon: History, color: 'text-ink-2' },
];

export default function SeguridadPage() {
  return (
    <>
      <PageHeader title="Seguridad" subtitle="Gestión de seguridad y salud ocupacional" />
      <Page>
        <Link
          to="condiciones"
          className="flex min-h-18 items-center justify-center gap-3 rounded-2xl bg-mina px-4 text-lg font-extrabold text-mina-ink shadow-lg shadow-mina/10 active:scale-[0.99]"
        >
          <AlertTriangle className="size-7" aria-hidden />
          REPORTAR CONDICIÓN INSEGURA
        </Link>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {MODULOS.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex min-h-32 flex-col justify-between rounded-2xl border border-line bg-surface p-4 transition hover:border-ink-3 active:scale-[0.98]"
            >
              <div className="grid size-12 place-items-center rounded-xl bg-surface-2">
                <Icon className={cx('size-6', color)} aria-hidden />
              </div>
              <span className="text-base leading-tight font-bold">{label}</span>
            </Link>
          ))}
        </div>
      </Page>
    </>
  );
}
