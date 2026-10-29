import { NavLink } from 'react-router-dom';
import { BarChart3, HardHat, Home, LayoutGrid, Truck, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Permiso } from '@/auth/permissions';
import { cx } from '@/utils/format';

const ITEMS: { to: string; label: string; icon: typeof Home; permiso?: Permiso }[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/seguridad', label: 'Seguridad', icon: HardHat },
  { to: '/personal', label: 'Personal', icon: Users },
  { to: '/equipos', label: 'Equipos', icon: Truck },
  { to: '/produccion', label: 'Producción', icon: BarChart3, permiso: 'produccion.ver' },
  { to: '/mas', label: 'Más', icon: LayoutGrid },
];

export function BottomNav() {
  const { can } = useAuth();
  const items = ITEMS.filter((i) => !i.permiso || can(i.permiso));
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur" aria-label="Navegación principal">
      <ul className="mx-auto flex max-w-5xl">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cx(
                  'relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition',
                  isActive ? 'text-mina' : 'text-ink-3 hover:text-ink-2',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-mina" aria-hidden />}
                  <Icon className="size-6" aria-hidden strokeWidth={isActive ? 2.4 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
