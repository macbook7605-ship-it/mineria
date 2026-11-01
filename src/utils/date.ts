import type { Turno } from '@/database/types';
import { OPERACION } from '@/config/operacion';

const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha local en formato YYYY-MM-DD. */
export function toISODate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 28/10/2026 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** "miércoles, 28 de octubre" */
export function formatLongDate(d: Date = new Date()): string {
  const s = d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function shortWeekday(iso: string): string {
  return parseISODate(iso).toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '');
}

/** Turno vigente según el horario configurado en la operación. */
export function currentShift(d: Date = new Date()): Turno {
  const h = d.getHours();
  return h >= OPERACION.turnoDia.inicio && h < OPERACION.turnoDia.fin ? 'dia' : 'noche';
}

export function shiftLabel(t: Turno): string {
  return t === 'dia' ? 'Día' : 'Noche';
}
