/**
 * Tipos del dominio. Cada interfaz corresponde a una tabla de la futura
 * base de datos en Supabase (ver supabase/README.md). Los nombres de campo
 * se mantienen en español para coincidir con el esquema.
 */

export type Rol = 'administrador' | 'supervisor' | 'trabajador';
export type Turno = 'dia' | 'noche';

export type EstadoPersonal = 'activo' | 'descanso' | 'inactivo';
export type EstadoEquipo = 'operativo' | 'mantenimiento' | 'fuera_servicio';
export type EstadoIncidente = 'abierto' | 'en_investigacion' | 'cerrado';
export type EstadoInspeccion = 'pendiente' | 'en_proceso' | 'cerrada';
export type EstadoCondicion = 'reportada' | 'en_atencion' | 'corregida';

/** Campos de auditoría presentes en todas las tablas operativas. */
export interface Auditable {
  creado_por: string;
  creado_en: string; // ISO
  modificado_por?: string;
  modificado_en?: string;
}

export interface Perfil {
  id: string;
  usuario: string;
  nombre: string;
  cargo: string;
  rol: Rol;
  estado: EstadoPersonal;
}

export interface Equipo {
  id: string;
  nombre: string;
  tipo: string;
  codigo: string;
  estado: EstadoEquipo;
  operador_id: string | null;
  horometro: number; // horas
  combustible: number; // porcentaje 0–100
  proximo_mantenimiento: number; // horómetro programado
}

export interface FallaEquipo extends Auditable {
  id: string;
  equipo_id: string;
  fecha: string;
  descripcion: string;
  resuelta: boolean;
}

export interface EventoEquipo extends Auditable {
  id: string;
  equipo_id: string;
  fecha: string;
  hora: string;
  descripcion: string;
}

/** Cada fila es una actividad dentro del turno. Los cambios agregan filas, nunca reemplazan. */
export interface HistorialActividad extends Auditable {
  id: string;
  trabajador_id: string;
  fecha: string; // YYYY-MM-DD
  turno: Turno;
  hora_inicio: string; // HH:mm
  actividad: string;
  area: string;
  equipo_id: string | null;
  observaciones?: string;
}

export interface Iperc extends Auditable {
  id: string;
  fecha: string;
  hora: string;
  area: string;
  actividad: string;
  peligro: string;
  riesgo: string;
  medida_control: string;
  responsable_id: string;
  confirmado: boolean;
}

export interface Charla extends Auditable {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  fecha_creacion: string;
  archivo_path: string | null; // ruta en storage privado
}

export interface ParticipacionCharla {
  id: string;
  charla_id: string;
  trabajador_id: string;
  fecha: string;
  hora: string;
  confirmado: boolean;
}

export interface Incidente extends Auditable {
  id: string;
  fecha: string;
  hora: string;
  area: string;
  persona_id: string | null;
  descripcion: string;
  tipo: string;
  medidas: string;
  estado: EstadoIncidente;
}

export interface Inspeccion extends Auditable {
  id: string;
  fecha: string;
  area: string;
  responsable_id: string;
  hallazgos: string;
  condiciones: string;
  acciones_correctivas: string;
  estado: EstadoInspeccion;
}

export interface CondicionInsegura extends Auditable {
  id: string;
  fecha: string;
  hora: string;
  area: string;
  descripcion: string;
  responsable_id: string;
  estado: EstadoCondicion;
}

export interface Produccion extends Auditable {
  id: string;
  fecha: string;
  turno: Turno;
  material: string;
  toneladas: number;
  viajes: number;
  horas: number;
  equipo_id: string;
  observaciones?: string;
}
