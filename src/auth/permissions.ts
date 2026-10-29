import type { Rol } from '@/database/types';

/**
 * Matriz de permisos por rol (punto 19 del requerimiento).
 * En la Etapa 2 la misma regla se aplica también en la base de datos (RLS),
 * para que la protección no dependa solo de la interfaz.
 */
export type Permiso =
  | 'usuarios.administrar'
  | 'configuracion.administrar'
  | 'charlas.subir'
  | 'charlas.charla_del_dia'
  | 'charlas.ver_participacion'
  | 'asignaciones.crear'
  | 'asignaciones.cambiar'
  | 'historial.ver_todo'
  | 'equipos.administrar'
  | 'produccion.ver'
  | 'produccion.registrar'
  | 'reportes.ver'
  | 'iperc.registrar'
  | 'inspecciones.registrar'
  | 'incidentes.registrar'
  | 'condiciones.reportar'
  | 'personal.ver_todo';

const SUPERVISOR: Permiso[] = [
  'historial.ver_todo',
  'iperc.registrar',
  'inspecciones.registrar',
  'incidentes.registrar',
  'condiciones.reportar',
  'asignaciones.crear',
  'asignaciones.cambiar',
  'charlas.ver_participacion',
  'produccion.ver',
  'personal.ver_todo',
];

const TRABAJADOR: Permiso[] = ['incidentes.registrar', 'condiciones.reportar'];

const ADMINISTRADOR: Permiso[] = [
  ...SUPERVISOR,
  'usuarios.administrar',
  'configuracion.administrar',
  'charlas.subir',
  'charlas.charla_del_dia',
  'equipos.administrar',
  'produccion.registrar',
  'reportes.ver',
];

export const PERMISOS_POR_ROL: Record<Rol, ReadonlySet<Permiso>> = {
  administrador: new Set(ADMINISTRADOR),
  supervisor: new Set(SUPERVISOR),
  trabajador: new Set(TRABAJADOR),
};

export const can = (rol: Rol | undefined, permiso: Permiso) => !!rol && PERMISOS_POR_ROL[rol].has(permiso);

export const ROL_LABEL: Record<Rol, string> = {
  administrador: 'Administrador',
  supervisor: 'Supervisor',
  trabajador: 'Trabajador',
};
