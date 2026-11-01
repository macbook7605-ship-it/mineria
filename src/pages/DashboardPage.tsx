import { AlertTriangle, BarChart3, ClipboardCheck, ClipboardList, HardHat, LogOut, MessageSquareText, Package, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ElementType } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { useAsync } from '@/hooks/useAsync';
import { actividadesActuales, getResumenTurno } from '@/services/dataService';
import { ROL_LABEL, type Permiso } from '@/auth/permissions';
import { currentShift, formatLongDate, shiftLabel } from '@/utils/date';
import { formatNumber } from '@/utils/format';
import { Page } from '@/components/layout/AppShell';
import { Logo } from '@/components/layout/Logo';
import { StatCard } from '@/components/ui/StatCard';
import { Section } from '@/components/ui/Section';
import { Loader } from '@/components/ui/Loader';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';

interface Accion {
  to: string;
  label: string;
  icon: ElementType;
  /** Si se define, solo se muestra a quien tenga el permiso. */
  permiso?: Permiso;
  accent?: boolean;
}

const ACCIONES: Accion[] = [
  { to: '/seguridad/iperc', label: 'Registrar IPERC', icon: ClipboardCheck, permiso: 'iperc.registrar' },
  { to: '/seguridad/charlas', label: 'Charla de seguridad', icon: MessageSquareText },
  { to: '/seguridad/incidentes', label: 'Reportar incidente', icon: AlertTriangle, permiso: 'incidentes.registrar', accent: true },
  { to: '/personal', label: 'Asignar trabajo', icon: ClipboardList, permiso: 'asignaciones.crear' },
  { to: '/equipos', label: 'Estado de equipos', icon: Truck },
  { to: '/produccion', label: 'Registrar producción', icon: BarChart3, permiso: 'produccion.ver' },
];

export default function DashboardPage() {
  const { user, can } = useAuth();
  const logout = useLogout();
  const { data: r, loading } = useAsync(getResumenTurno);
  const turno = currentShift();
  const miActividad = user ? actividadesActuales().get(user.id) : undefined;

  if (!user) return null;

  return (
    <>
      <header className="pt-safe border-b border-line bg-gradient-to-b from-surface to-base">
        <div className="mx-auto max-w-5xl px-4 pt-4 pb-5">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={logout}
              className="grid size-12 place-items-center rounded-xl text-ink-3 hover:bg-surface-2 hover:text-ink"
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-5" />
            </button>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Avatar name={user.nombre} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold">{user.nombre}</p>
              <p className="text-sm text-ink-2">{ROL_LABEL[user.rol]}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-lg bg-surface-2 px-3 py-1.5 text-ink-2">{formatLongDate()}</span>
            <span className="rounded-lg bg-mina/15 px-3 py-1.5 font-semibold text-mina">Turno {shiftLabel(turno)}</span>
          </div>
        </div>
      </header>

      <Page>
        {user.rol === 'trabajador' && (
          <Section title="Mi actividad asignada">
            <Card className="flex items-center gap-3 border-mina/30">
              <HardHat className="size-8 shrink-0 text-mina" aria-hidden />
              {miActividad ? (
                <div>
                  <p className="text-lg font-bold">{miActividad.actividad}</p>
                  <p className="text-sm text-ink-2">
                    {miActividad.area} · desde {miActividad.hora_inicio}
                  </p>
                </div>
              ) : (
                <p className="text-ink-2">Sin actividad asignada en este turno.</p>
              )}
            </Card>
          </Section>
        )}

        <Section title="Resumen del turno">
          {loading || !r ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 gap-3 max-md:[&>*:last-child:nth-child(odd)]:col-span-2 md:grid-cols-3 lg:grid-cols-5">
              <StatCard icon={Users} label="Personal activo" value={r.personalActivo} detail={`de ${r.personalTotal} trabajadores`} tone="info" to="/personal" />
              <StatCard
                icon={Truck}
                label="Equipos operativos"
                value={`${r.equiposOperativos}/${r.equiposTotal}`}
                detail={r.equiposOperativos < r.equiposTotal ? `${r.equiposTotal - r.equiposOperativos} fuera de operación` : 'Todos operativos'}
                tone={r.equiposOperativos < r.equiposTotal ? 'warn' : 'ok'}
                to="/equipos"
              />
              {can('produccion.ver') && (
                <StatCard icon={Package} label="Producción del día" value={formatNumber(r.produccionHoy)} detail="toneladas" to="/produccion" />
              )}
              <StatCard
                icon={AlertTriangle}
                label="Incidentes"
                value={r.incidentesHoy}
                detail="reportados hoy"
                tone={r.incidentesHoy > 0 ? 'danger' : 'ok'}
                to="/seguridad/incidentes"
              />
              <StatCard icon={ClipboardCheck} label="IPERC realizados" value={r.ipercHoy} detail="en el turno" tone="ok" to="/seguridad/iperc" />
            </div>
          )}
        </Section>

        <Section title="Acciones rápidas">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {ACCIONES.filter((a) => !a.permiso || can(a.permiso)).map(({ to, label, icon: Icon, accent }) => (
              <Link
                key={label}
                to={to}
                className={
                  accent
                    ? 'flex min-h-24 flex-col justify-between gap-2 rounded-2xl border border-danger/40 bg-danger/10 p-4 font-bold text-ink transition active:scale-[0.98]'
                    : 'flex min-h-24 flex-col justify-between gap-2 rounded-2xl border border-line bg-surface p-4 font-bold transition hover:border-mina/50 active:scale-[0.98]'
                }
              >
                <Icon className={accent ? 'size-7 text-danger' : 'size-7 text-mina'} aria-hidden />
                <span className="leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </Section>
      </Page>
    </>
  );
}
