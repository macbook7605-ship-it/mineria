import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/** Cierre de sesión voluntario: el próximo ingreso vuelve al inicio, no a la última ruta. */
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return async () => {
    await logout();
    navigate('/login', { replace: true, state: null });
  };
}
