/**
 * Capa de acceso a datos. Las páginas solo usan estas funciones;
 * en la Etapa 2 su implementación pasa de los datos de demostración a Supabase
 * sin cambiar las páginas.
 */
import * as demo from '@/database/demo/seed';
import type { HistorialActividad, Perfil } from '@/database/types';
import { addDays, toISODate } from '@/utils/date';

const latency = <T>(value: T): Promise<T> => new Promise((r) => setTimeout(() => r(value), 120));
const byTimeDesc = <T extends { fecha: string; hora?: string; hora_inicio?: string }>(a: T, b: T) =>
  (b.fecha + (b.hora ?? b.hora_inicio ?? '')).localeCompare(a.fecha + (a.hora ?? a.hora_inicio ?? ''));

/* ---------- Personal ---------- */
export const getPerfiles = () => latency(demo.perfiles);
export const getPerfil = (id: string) => latency(demo.perfiles.find((p) => p.id === id) ?? null);
export const getTrabajadores = () => latency(demo.perfiles.filter((p) => p.rol === 'trabajador'));

/** Historial de actividades de un trabajador (más reciente primero). */
export const getHistorialTrabajador = (trabajadorId: string) =>
  latency(demo.historialActividades.filter((a) => a.trabajador_id === trabajadorId).sort(byTimeDesc));

/** Última actividad registrada hoy para cada trabajador. */
export function actividadesActuales(fecha = toISODate()): Map<string, HistorialActividad> {
  const map = new Map<string, HistorialActividad>();
  demo.historialActividades
    .filter((a) => a.fecha === fecha)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    .forEach((a) => map.set(a.trabajador_id, a));
  return map;
}

export const nombrePorId = (id: string | null | undefined): string =>
  (id && demo.perfiles.find((p) => p.id === id)?.nombre) || '—';

export const perfilPorId = (id: string): Perfil | undefined => demo.perfiles.find((p) => p.id === id);

/* ---------- Equipos ---------- */
export const getEquipos = () => latency(demo.equipos);
export const getEquipo = (id: string) => latency(demo.equipos.find((e) => e.id === id) ?? null);
export const getFallasEquipo = (id: string) => latency(demo.fallas.filter((f) => f.equipo_id === id));
export const getEventosEquipo = (id: string) => latency(demo.eventosEquipo.filter((e) => e.equipo_id === id).sort(byTimeDesc));
export const equipoPorId = (id: string | null | undefined) => (id ? demo.equipos.find((e) => e.id === id) : undefined);

/* ---------- Seguridad ---------- */
export const getIperc = () => latency([...demo.iperc].sort(byTimeDesc));
export const getIncidentes = () => latency([...demo.incidentes].sort(byTimeDesc));
export const getInspecciones = () => latency([...demo.inspecciones].sort(byTimeDesc));
export const getCondiciones = () => latency([...demo.condiciones].sort(byTimeDesc));
export const getCharlas = () => latency(demo.charlas);

export async function getCharlaDelDia() {
  const { charla_id, fecha } = demo.charlaDelDia;
  const charla = demo.charlas.find((c) => c.id === charla_id) ?? null;
  const confirmados = demo.participaciones.filter((p) => p.charla_id === charla_id && p.fecha === fecha && p.confirmado);
  const trabajadores = demo.perfiles.filter((p) => p.rol === 'trabajador' && p.estado === 'activo');
  const pendientes = trabajadores.filter((t) => !confirmados.some((c) => c.trabajador_id === t.id));
  return latency({ charla, fecha, confirmados, pendientes });
}

export const getParticipacionesTrabajador = (id: string) =>
  latency(
    demo.participaciones
      .filter((p) => p.trabajador_id === id && p.confirmado)
      .map((p) => ({ ...p, charla: demo.charlas.find((c) => c.id === p.charla_id) }))
      .sort(byTimeDesc),
  );

export const getIpercTrabajador = (id: string) => latency(demo.iperc.filter((i) => i.responsable_id === id).sort(byTimeDesc));
export const getIncidentesTrabajador = (id: string) => latency(demo.incidentes.filter((i) => i.persona_id === id).sort(byTimeDesc));

/* ---------- Producción ---------- */
export const getProduccion = () => latency([...demo.produccion].sort((a, b) => b.fecha.localeCompare(a.fecha)));

export interface ResumenDia {
  fecha: string;
  toneladas: number;
  viajes: number;
  horas: number;
}

/** Totales por día de los últimos `dias` días (incluye días sin producción). */
export async function getResumenProduccion(dias = 7): Promise<ResumenDia[]> {
  const hoy = toISODate();
  const out: ResumenDia[] = [];
  for (let i = dias - 1; i >= 0; i--) {
    const fecha = addDays(hoy, -i);
    const regs = demo.produccion.filter((p) => p.fecha === fecha);
    out.push({
      fecha,
      toneladas: regs.reduce((s, r) => s + r.toneladas, 0),
      viajes: regs.reduce((s, r) => s + r.viajes, 0),
      horas: regs.reduce((s, r) => s + r.horas, 0),
    });
  }
  return latency(out);
}

/* ---------- Dashboard ---------- */
export async function getResumenTurno() {
  const hoy = toISODate();
  const actuales = actividadesActuales(hoy);
  return latency({
    personalActivo: demo.perfiles.filter((p) => p.rol === 'trabajador' && actuales.has(p.id)).length,
    personalTotal: demo.perfiles.filter((p) => p.rol === 'trabajador').length,
    equiposOperativos: demo.equipos.filter((e) => e.estado === 'operativo').length,
    equiposTotal: demo.equipos.length,
    produccionHoy: demo.produccion.filter((p) => p.fecha === hoy).reduce((s, r) => s + r.toneladas, 0),
    incidentesHoy: demo.incidentes.filter((i) => i.fecha === hoy).length,
    ipercHoy: demo.iperc.filter((i) => i.fecha === hoy).length,
  });
}

/** Línea de tiempo combinada para Seguridad → Historial. */
export async function getHistorialSeguridad() {
  const items = [
    ...demo.iperc.map((r) => ({ id: r.id, tipo: 'IPERC' as const, fecha: r.fecha, hora: r.hora, titulo: r.actividad, area: r.area })),
    ...demo.incidentes.map((r) => ({ id: r.id, tipo: 'Incidente' as const, fecha: r.fecha, hora: r.hora, titulo: r.tipo, area: r.area })),
    ...demo.inspecciones.map((r) => ({ id: r.id, tipo: 'Inspección' as const, fecha: r.fecha, hora: '', titulo: r.hallazgos, area: r.area })),
    ...demo.condiciones.map((r) => ({ id: r.id, tipo: 'Condición insegura' as const, fecha: r.fecha, hora: r.hora, titulo: r.descripcion, area: r.area })),
  ];
  return latency(items.sort(byTimeDesc));
}
