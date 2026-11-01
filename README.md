# MINERÍA CONTROL

Aplicación web / PWA de uso interno para la operación minera: seguridad, IPERC, charlas, incidentes, inspecciones, condiciones inseguras, personal, equipos y producción.

Prioridad de diseño: **celular → tablet → computadora**.

## Estado: Etapa 1 (interfaz + datos de demostración)

| Etapa | Contenido | Estado |
|---|---|---|
| 1 | Login, Dashboard, navegación, Seguridad, Personal, Equipos, Producción, Más | ✅ |
| 2 | Supabase, autenticación real, usuarios, roles, base de datos | Pendiente |
| 3 | Biblioteca de charlas, subida de PDF, charla del día, confirmación de lectura | Pendiente |
| 4 | Asignaciones, cambios de actividad, historial, relación con IPERC | Pendiente |
| 5 | Incidentes, inspecciones, condiciones inseguras, reportes, auditoría | Pendiente |

En la Etapa 1 **no se guarda información**: los botones de registro aparecen deshabilitados con un aviso de la etapa en la que se activan.

### Usuarios de demostración

Contraseña para todos: `mina2026`

| Usuario | Rol |
|---|---|
| `admin` | Administrador |
| `supervisor` | Supervisor |
| `juan`, `pedro`, `luis`, `carlos`, `miguel` | Trabajador |

## Tecnología

- **React 19 + TypeScript + Vite** — aplicación de una sola página, rápida en celular.
- **Tailwind CSS 4** — estilos; los colores de la marca están en `src/styles/index.css`.
- **React Router** — rutas protegidas por sesión y por permiso.
- **vite-plugin-pwa** — instalable en Android / iPhone, funciona con mala señal (archivos en caché).
- **Supabase** (Etapa 2) — base de datos PostgreSQL, autenticación y almacenamiento privado de PDF.

## Comandos

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # compilación de producción en dist/
npm run preview   # sirve dist/ (para probar la PWA)
```

## Estructura

```
src/
  auth/         Contexto de sesión, rutas protegidas, matriz de permisos por rol
  components/
    layout/     AppShell, barra de navegación inferior, encabezados, logo
    ui/         Botones, tarjetas, estados, listas, tabla de historial
  config/       Parámetros de la operación (turnos, áreas)
  database/     Tipos del dominio (= tablas) y datos de demostración
  hooks/        useAuth, useAsync, useLogout
  pages/        Una carpeta por módulo (seguridad, personal, equipos, produccion, mas)
  services/     authService y dataService: única puerta de acceso a datos
  styles/       CSS global y tema
  utils/        Fechas, turnos, formatos
```

**Regla de arquitectura:** las páginas nunca leen los datos directamente; siempre pasan por `services/`. En la Etapa 2 solo se reemplaza la implementación de `dataService.ts` y `authService.ts` por Supabase, sin rehacer las pantallas.

## Seguridad (preparada para la Etapa 2)

- Los permisos por rol están en `src/auth/permissions.ts`. La interfaz oculta y bloquea lo no permitido, pero **la protección real se aplicará en la base de datos con RLS (Row Level Security) de Supabase**, para que un trabajador no pueda leer ni borrar registros aunque manipule la app.
- Los registros históricos no se eliminan: las tablas operativas llevan `creado_por`, `creado_en`, `modificado_por`, `modificado_en` y habrá una tabla `auditoria`.
- Los cambios de actividad **agregan** una fila en `historial_actividades`; nunca reemplazan la anterior.
- Los PDF de charlas irán a un bucket **privado** de Supabase Storage y se abrirán con enlaces firmados de corta duración.
