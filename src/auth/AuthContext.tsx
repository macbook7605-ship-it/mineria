import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { authService, type Sesion } from '@/services/authService';
import { can, type Permiso } from './permissions';
import type { Perfil } from '@/database/types';

interface AuthValue {
  user: Perfil | null;
  login: (usuario: string, password: string, recordar: boolean) => Promise<void>;
  logout: () => Promise<void>;
  can: (permiso: Permiso) => boolean;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() => authService.restore());

  const login = useCallback(async (u: string, p: string, r: boolean) => {
    setSesion(await authService.login(u, p, r));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSesion(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user: sesion?.perfil ?? null,
      login,
      logout,
      can: (permiso) => can(sesion?.perfil.rol, permiso),
    }),
    [sesion, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
