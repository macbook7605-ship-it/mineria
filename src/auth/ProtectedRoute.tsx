import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Permiso } from './permissions';
import { EmptyState } from '@/components/ui/EmptyState';

/** Exige sesión iniciada; si no, redirige al login recordando la ruta. */
export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Exige un permiso concreto para mostrar la ruta. */
export function RequirePermission({ permiso }: { permiso: Permiso }) {
  const { can } = useAuth();
  if (!can(permiso))
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Acceso restringido"
        text="Su rol no tiene permiso para ver esta sección. Consulte con el administrador."
      />
    );
  return <Outlet />;
}
