import type { EstadoCondicion, EstadoEquipo, EstadoIncidente, EstadoInspeccion, EstadoPersonal } from '@/database/types';
import type { Tone } from './Badge';

type Meta = { label: string; tone: Tone };

export const ESTADO_EQUIPO: Record<EstadoEquipo, Meta> = {
  operativo: { label: 'Operativo', tone: 'ok' },
  mantenimiento: { label: 'Mantenimiento', tone: 'warn' },
  fuera_servicio: { label: 'Fuera de servicio', tone: 'danger' },
};

export const ESTADO_INCIDENTE: Record<EstadoIncidente, Meta> = {
  abierto: { label: 'Abierto', tone: 'danger' },
  en_investigacion: { label: 'En investigación', tone: 'warn' },
  cerrado: { label: 'Cerrado', tone: 'ok' },
};

export const ESTADO_INSPECCION: Record<EstadoInspeccion, Meta> = {
  pendiente: { label: 'Pendiente', tone: 'warn' },
  en_proceso: { label: 'En proceso', tone: 'info' },
  cerrada: { label: 'Cerrada', tone: 'ok' },
};

export const ESTADO_CONDICION: Record<EstadoCondicion, Meta> = {
  reportada: { label: 'Reportada', tone: 'danger' },
  en_atencion: { label: 'En atención', tone: 'warn' },
  corregida: { label: 'Corregida', tone: 'ok' },
};

export const ESTADO_PERSONAL: Record<EstadoPersonal, Meta> = {
  activo: { label: 'Activo', tone: 'ok' },
  descanso: { label: 'Descanso', tone: 'info' },
  inactivo: { label: 'Inactivo', tone: 'neutral' },
};
