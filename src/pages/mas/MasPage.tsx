import { BookOpen, FileBarChart, LogOut, Settings, UserCog } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { ListRow } from '@/components/ui/ListRow';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import type { Permiso } from '@/auth/permissions';

const OPCIONES: { to: string; label: string; detalle: string; icon: typeof BookOpen; permiso?: Permiso }[] = [
  { to: '/mas/reportes', label: 'Reportes', detalle: 'Resúmenes de seguridad y operación', icon: FileBarChart, permiso: 'reportes.ver' },
  { to: '/mas/biblioteca', label: 'Biblioteca de charlas', detalle: 'Charlas de seguridad en PDF', icon: BookOpen },
  { to: '/mas/configuracion', label: 'Configuración', detalle: 'Parámetros de la operación', icon: Settings, permiso: 'configuracion.administrar' },
  { to: '/mas/usuarios', label: 'Usuarios', detalle: 'Cuentas, roles y accesos', icon: UserCog, permiso: 'usuarios.administrar' },
];

export default function MasPage() {
  const { can } = useAuth();
  const logout = useLogout();
  return (
    <>
      <PageHeader title="Más" />
      <Page>
        <div className="space-y-2">
          {OPCIONES.filter((o) => !o.permiso || can(o.permiso)).map((o) => (
            <ListRow key={o.to} to={o.to} icon={o.icon} title={o.label} subtitle={o.detalle} />
          ))}
        </div>
        <Button block variant="secondary" icon={LogOut} onClick={logout}>
          CERRAR SESIÓN
        </Button>
        <p className="text-center text-xs text-ink-3">MINERÍA CONTROL · v{__APP_VERSION__}</p>
      </Page>
    </>
  );
}
