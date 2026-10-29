/**
 * DATOS DE DEMOSTRACIÓN — solo para visualizar la Etapa 1.
 * Se reemplazan por consultas a Supabase en la Etapa 2.
 * Las fechas se generan relativas al día actual.
 */
import type {
  Charla,
  CondicionInsegura,
  Equipo,
  EventoEquipo,
  FallaEquipo,
  HistorialActividad,
  Incidente,
  Inspeccion,
  Iperc,
  ParticipacionCharla,
  Perfil,
  Produccion,
} from '../types';
import { addDays, currentShift, toISODate } from '@/utils/date';

const HOY = toISODate();
const TURNO = currentShift();
const AYER = addDays(HOY, -1);
const audit = (fecha = HOY, por = 'u-sup') => ({ creado_por: por, creado_en: `${fecha}T08:00:00` });

export const perfiles: Perfil[] = [
  { id: 'u-adm', usuario: 'admin', nombre: 'Raúl Mendoza', cargo: 'Jefe de operaciones', rol: 'administrador', estado: 'activo' },
  { id: 'u-sup', usuario: 'supervisor', nombre: 'Víctor Quispe', cargo: 'Supervisor de seguridad', rol: 'supervisor', estado: 'activo' },
  { id: 'u-juan', usuario: 'juan', nombre: 'Juan Ramírez', cargo: 'Operador de cargador', rol: 'trabajador', estado: 'activo' },
  { id: 'u-pedro', usuario: 'pedro', nombre: 'Pedro Huamán', cargo: 'Conductor de volquete', rol: 'trabajador', estado: 'activo' },
  { id: 'u-luis', usuario: 'luis', nombre: 'Luis Condori', cargo: 'Conductor de volquete', rol: 'trabajador', estado: 'activo' },
  { id: 'u-carlos', usuario: 'carlos', nombre: 'Carlos Flores', cargo: 'Mecánico', rol: 'trabajador', estado: 'activo' },
  { id: 'u-miguel', usuario: 'miguel', nombre: 'Miguel Torres', cargo: 'Operario de planta', rol: 'trabajador', estado: 'activo' },
  { id: 'u-jose', usuario: 'jose', nombre: 'José Vargas', cargo: 'Ayudante general', rol: 'trabajador', estado: 'descanso' },
];

export const equipos: Equipo[] = [
  { id: 'e-cf01', nombre: 'Cargador frontal', tipo: 'Cargador frontal', codigo: 'CF-01', estado: 'operativo', operador_id: 'u-carlos', horometro: 8452.5, combustible: 64, proximo_mantenimiento: 8500 },
  { id: 'e-vq01', nombre: 'Volquete 01', tipo: 'Volquete', codigo: 'VQ-01', estado: 'operativo', operador_id: 'u-pedro', horometro: 12310.0, combustible: 78, proximo_mantenimiento: 12500 },
  { id: 'e-vq02', nombre: 'Volquete 02', tipo: 'Volquete', codigo: 'VQ-02', estado: 'mantenimiento', operador_id: null, horometro: 11987.2, combustible: 35, proximo_mantenimiento: 12000 },
];

export const fallas: FallaEquipo[] = [
  { id: 'f1', equipo_id: 'e-vq02', fecha: HOY, descripcion: 'Fuga de aceite hidráulico en cilindro de tolva', resuelta: false, ...audit() },
  { id: 'f2', equipo_id: 'e-cf01', fecha: addDays(HOY, -6), descripcion: 'Luz de retroceso inoperativa', resuelta: true, ...audit(addDays(HOY, -6)) },
];

export const eventosEquipo: EventoEquipo[] = [
  { id: 'ev1', equipo_id: 'e-vq02', fecha: HOY, hora: '09:15', descripcion: 'Ingresa a taller por fuga hidráulica', ...audit() },
  { id: 'ev2', equipo_id: 'e-cf01', fecha: HOY, hora: '14:00', descripcion: 'Cambio de operador: Juan Ramírez → Carlos Flores', ...audit() },
  { id: 'ev3', equipo_id: 'e-cf01', fecha: HOY, hora: '07:30', descripcion: 'Inspección pre-uso conforme', ...audit() },
  { id: 'ev4', equipo_id: 'e-vq01', fecha: HOY, hora: '07:20', descripcion: 'Inspección pre-uso conforme', ...audit() },
  { id: 'ev5', equipo_id: 'e-vq02', fecha: AYER, hora: '18:40', descripcion: 'Abastecimiento de combustible', ...audit(AYER) },
  { id: 'ev6', equipo_id: 'e-cf01', fecha: addDays(HOY, -6), hora: '10:00', descripcion: 'Reparación de luz de retroceso', ...audit(addDays(HOY, -6)) },
];

/** Ejemplo del enunciado: Juan cambia de actividad a las 14:00 sin perder el registro anterior. */
export const historialActividades: HistorialActividad[] = [
  { id: 'a1', trabajador_id: 'u-juan', fecha: HOY, turno: TURNO, hora_inicio: '08:00', actividad: 'Cargador frontal', area: 'Planta', equipo_id: 'e-cf01', ...audit() },
  { id: 'a2', trabajador_id: 'u-pedro', fecha: HOY, turno: TURNO, hora_inicio: '08:00', actividad: 'Volquete 01', area: 'Transporte', equipo_id: 'e-vq01', ...audit() },
  { id: 'a3', trabajador_id: 'u-luis', fecha: HOY, turno: TURNO, hora_inicio: '08:00', actividad: 'Volquete 02', area: 'Transporte', equipo_id: 'e-vq02', ...audit() },
  { id: 'a4', trabajador_id: 'u-carlos', fecha: HOY, turno: TURNO, hora_inicio: '08:00', actividad: 'Mantenimiento', area: 'Taller', equipo_id: null, ...audit() },
  { id: 'a5', trabajador_id: 'u-miguel', fecha: HOY, turno: TURNO, hora_inicio: '08:00', actividad: 'Clasificación', area: 'Planta', equipo_id: null, ...audit() },
  { id: 'a6', trabajador_id: 'u-luis', fecha: HOY, turno: TURNO, hora_inicio: '09:30', actividad: 'Apoyo', area: 'Planta', equipo_id: null, observaciones: 'Volquete 02 ingresa a mantenimiento', ...audit() },
  { id: 'a7', trabajador_id: 'u-juan', fecha: HOY, turno: TURNO, hora_inicio: '14:00', actividad: 'Mantenimiento', area: 'Taller', equipo_id: null, ...audit() },
  { id: 'a8', trabajador_id: 'u-carlos', fecha: HOY, turno: TURNO, hora_inicio: '14:00', actividad: 'Cargador frontal', area: 'Planta', equipo_id: 'e-cf01', ...audit() },
  { id: 'a9', trabajador_id: 'u-juan', fecha: AYER, turno: 'dia', hora_inicio: '08:00', actividad: 'Cargador frontal', area: 'Planta', equipo_id: 'e-cf01', ...audit(AYER) },
  { id: 'a10', trabajador_id: 'u-jose', fecha: AYER, turno: 'dia', hora_inicio: '08:00', actividad: 'Apoyo', area: 'Planta', equipo_id: null, ...audit(AYER) },
];

export const iperc: Iperc[] = [
  { id: 'ip1', fecha: HOY, hora: '07:40', area: 'Planta', actividad: 'Carguío con cargador frontal', peligro: 'Equipo en movimiento', riesgo: 'Atropello / aplastamiento', medida_control: 'Delimitar zona de carguío, vigía, contacto visual con operador', responsable_id: 'u-juan', confirmado: true, ...audit() },
  { id: 'ip2', fecha: HOY, hora: '07:45', area: 'Transporte', actividad: 'Transporte de material en volquete', peligro: 'Vía con pendiente', riesgo: 'Volcadura', medida_control: 'Velocidad máxima 20 km/h, inspección pre-uso de frenos', responsable_id: 'u-pedro', confirmado: true, ...audit() },
  { id: 'ip3', fecha: HOY, hora: '14:05', area: 'Taller', actividad: 'Mantenimiento de volquete', peligro: 'Aceite hidráulico a presión', riesgo: 'Proyección de fluido / quemadura', medida_control: 'Bloqueo y etiquetado, despresurizar sistema, careta facial', responsable_id: 'u-juan', confirmado: true, ...audit() },
  { id: 'ip4', fecha: AYER, hora: '07:40', area: 'Planta', actividad: 'Clasificación manual', peligro: 'Material particulado', riesgo: 'Afección respiratoria', medida_control: 'Respirador con filtro, humedecer material', responsable_id: 'u-miguel', confirmado: true, ...audit(AYER) },
];

export const charlas: Charla[] = [
  { id: 'c1', titulo: 'Seguridad con maquinaria pesada', categoria: 'Maquinaria', descripcion: 'Puntos ciegos, distancias seguras y comunicación con operadores.', fecha_creacion: addDays(HOY, -20), archivo_path: null, ...audit(addDays(HOY, -20), 'u-adm') },
  { id: 'c2', titulo: 'Uso correcto de EPP', categoria: 'EPP', descripcion: 'Selección, inspección y uso del equipo de protección personal.', fecha_creacion: addDays(HOY, -25), archivo_path: null, ...audit(addDays(HOY, -25), 'u-adm') },
  { id: 'c3', titulo: 'Identificación de peligros', categoria: 'Gestión de riesgos', descripcion: 'Cómo reconocer peligros antes de iniciar la tarea.', fecha_creacion: addDays(HOY, -30), archivo_path: null, ...audit(addDays(HOY, -30), 'u-adm') },
  { id: 'c4', titulo: 'Prevención de incendios', categoria: 'Emergencias', descripcion: 'Clases de fuego y uso de extintores.', fecha_creacion: addDays(HOY, -32), archivo_path: null, ...audit(addDays(HOY, -32), 'u-adm') },
];

export const charlaDelDia = { fecha: HOY, charla_id: 'c1' };

export const participaciones: ParticipacionCharla[] = [
  { id: 'p1', charla_id: 'c1', trabajador_id: 'u-juan', fecha: HOY, hora: '07:32', confirmado: true },
  { id: 'p2', charla_id: 'c1', trabajador_id: 'u-pedro', fecha: HOY, hora: '07:35', confirmado: true },
  { id: 'p3', charla_id: 'c1', trabajador_id: 'u-miguel', fecha: HOY, hora: '07:41', confirmado: true },
  { id: 'p4', charla_id: 'c2', trabajador_id: 'u-juan', fecha: AYER, hora: '07:30', confirmado: true },
  { id: 'p5', charla_id: 'c2', trabajador_id: 'u-carlos', fecha: AYER, hora: '07:33', confirmado: true },
];

export const incidentes: Incidente[] = [
  { id: 'in1', fecha: HOY, hora: '10:20', area: 'Planta', persona_id: 'u-miguel', descripcion: 'Corte leve en la mano al retirar material de la zaranda.', tipo: 'Incidente con lesión leve', medidas: 'Primeros auxilios, se refuerza uso de guantes anticorte.', estado: 'en_investigacion', ...audit() },
  { id: 'in2', fecha: addDays(HOY, -3), hora: '16:05', area: 'Transporte', persona_id: 'u-luis', descripcion: 'Volquete roza talud en curva cerrada sin daños.', tipo: 'Cuasi accidente', medidas: 'Se señaliza curva y se reduce velocidad.', estado: 'cerrado', ...audit(addDays(HOY, -3)) },
];

export const inspecciones: Inspeccion[] = [
  { id: 'is1', fecha: HOY, area: 'Taller', responsable_id: 'u-sup', hallazgos: 'Extintor con presión baja.', condiciones: 'Orden y limpieza aceptable.', acciones_correctivas: 'Recargar extintor PQS de 12 kg.', estado: 'en_proceso', ...audit() },
  { id: 'is2', fecha: addDays(HOY, -2), area: 'Planta', responsable_id: 'u-sup', hallazgos: 'Guarda de faja retirada.', condiciones: 'Zona de tránsito despejada.', acciones_correctivas: 'Reinstalar guarda antes de operar.', estado: 'cerrada', ...audit(addDays(HOY, -2)) },
];

export const condiciones: CondicionInsegura[] = [
  { id: 'ci1', fecha: HOY, hora: '08:50', area: 'Transporte', descripcion: 'Bache profundo en vía de acarreo, km 1.2.', responsable_id: 'u-pedro', estado: 'reportada', ...audit(HOY, 'u-pedro') },
  { id: 'ci2', fecha: AYER, hora: '15:10', area: 'Almacén', descripcion: 'Cilindros apilados sin sujeción.', responsable_id: 'u-jose', estado: 'corregida', ...audit(AYER, 'u-jose') },
];

// [toneladas, viajes, horas] de los últimos 7 días (hoy al final; 0 = sin operación)
const prodBase: [number, number, number][] = [
  [312, 26, 22], [298, 25, 21], [0, 0, 0], [345, 29, 23], [330, 27, 22], [356, 30, 23], [186, 16, 12],
];

export const produccion: Produccion[] = prodBase.flatMap(([t, v, h], i) => {
  if (t === 0) return [];
  const fecha = addDays(HOY, i - 6);
  const tm = Math.round(t * 0.7);
  const vm = Math.round(v * 0.7);
  const hm = Math.round(h * 0.55);
  return [
    { id: `pr${i}a`, fecha, turno: 'dia' as const, material: 'Mineral', toneladas: tm, viajes: vm, horas: hm, equipo_id: 'e-vq01', ...audit(fecha) },
    { id: `pr${i}b`, fecha, turno: 'dia' as const, material: 'Desmonte', toneladas: t - tm, viajes: v - vm, horas: h - hm, equipo_id: i === 6 ? 'e-vq01' : 'e-vq02', observaciones: i === 6 ? 'VQ-02 en mantenimiento' : undefined, ...audit(fecha) },
  ];
});
