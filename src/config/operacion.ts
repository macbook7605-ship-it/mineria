/** Parámetros de la operación. En la Etapa 2 se moverán a la tabla de configuración. */
export const OPERACION = {
  nombre: 'MINERÍA CONTROL',
  turnoDia: { inicio: 7, fin: 19 }, // 07:00 – 19:00
  areas: ['Planta', 'Transporte', 'Taller', 'Tajo', 'Almacén'],
} as const;
