/**
 * Servicio de autenticación.
 *
 * ETAPA 1: modo demostración, valida contra usuarios de ejemplo.
 * ETAPA 2: se reemplaza `demoProvider` por Supabase Auth
 * (signInWithPassword / getSession / signOut) manteniendo esta misma interfaz.
 */
import { perfiles } from '@/database/demo/seed';
import type { Perfil } from '@/database/types';

export interface Sesion {
  perfil: Perfil;
  iniciada: string; // ISO
}

interface AuthProvider {
  signIn(usuario: string, password: string): Promise<Perfil>;
  signOut(): Promise<void>;
}

export const DEMO_PASSWORD = 'mina2026';

const demoProvider: AuthProvider = {
  async signIn(usuario, password) {
    await new Promise((r) => setTimeout(r, 350));
    const perfil = perfiles.find((p) => p.usuario === usuario.trim().toLowerCase());
    if (!perfil || password !== DEMO_PASSWORD) throw new Error('Usuario o contraseña incorrectos.');
    if (perfil.estado === 'inactivo') throw new Error('Usuario deshabilitado. Contacte al administrador.');
    return perfil;
  },
  async signOut() {},
};

const provider: AuthProvider = demoProvider;
const KEY = 'mc.sesion';

/** "Recordar sesión": localStorage persiste; si no, sessionStorage (se borra al cerrar la app). */
function storages(): Storage[] {
  try {
    return [localStorage, sessionStorage];
  } catch {
    return [];
  }
}

export const authService = {
  async login(usuario: string, password: string, recordar: boolean): Promise<Sesion> {
    const perfil = await provider.signIn(usuario, password);
    const sesion: Sesion = { perfil, iniciada: new Date().toISOString() };
    try {
      (recordar ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(sesion));
    } catch {
      /* almacenamiento no disponible: la sesión vive solo en memoria */
    }
    return sesion;
  },

  async logout() {
    await provider.signOut();
    storages().forEach((s) => s.removeItem(KEY));
  },

  restore(): Sesion | null {
    for (const s of storages()) {
      const raw = s.getItem(KEY);
      if (!raw) continue;
      try {
        const sesion = JSON.parse(raw) as Sesion;
        // Revalida contra la fuente de perfiles (rol/estado pueden haber cambiado).
        const perfil = perfiles.find((p) => p.id === sesion.perfil.id);
        if (perfil && perfil.estado !== 'inactivo') return { ...sesion, perfil };
      } catch {
        /* sesión corrupta */
      }
      s.removeItem(KEY);
    }
    return null;
  },
};
