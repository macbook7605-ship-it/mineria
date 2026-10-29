import { lazy, Suspense } from 'react';
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthContext';
import { RequireAuth, RequirePermission } from '@/auth/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { Loader } from '@/components/ui/Loader';

// Carga diferida por página: el teléfono solo descarga lo que abre.
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SeguridadPage = lazy(() => import('@/pages/seguridad/SeguridadPage'));
const IpercPage = lazy(() => import('@/pages/seguridad/IpercPage'));
const CharlasPage = lazy(() => import('@/pages/seguridad/CharlasPage'));
const IncidentesPage = lazy(() => import('@/pages/seguridad/IncidentesPage'));
const InspeccionesPage = lazy(() => import('@/pages/seguridad/InspeccionesPage'));
const CondicionesPage = lazy(() => import('@/pages/seguridad/CondicionesPage'));
const HistorialSeguridadPage = lazy(() => import('@/pages/seguridad/HistorialSeguridadPage'));
const PersonalPage = lazy(() => import('@/pages/personal/PersonalPage'));
const TrabajadorPage = lazy(() => import('@/pages/personal/TrabajadorPage'));
const EquiposPage = lazy(() => import('@/pages/equipos/EquiposPage'));
const EquipoDetallePage = lazy(() => import('@/pages/equipos/EquipoDetallePage'));
const ProduccionPage = lazy(() => import('@/pages/produccion/ProduccionPage'));
const MasPage = lazy(() => import('@/pages/mas/MasPage'));
const BibliotecaPage = lazy(() => import('@/pages/mas/BibliotecaPage'));
const ReportesPage = lazy(() => import('@/pages/mas/ReportesPage'));
const ConfiguracionPage = lazy(() => import('@/pages/mas/ConfiguracionPage'));
const UsuariosPage = lazy(() => import('@/pages/mas/UsuariosPage'));

// La vista previa se aloja en un marco donde la URL no es controlable.
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter;

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route index element={<DashboardPage />} />

                <Route path="seguridad">
                  <Route index element={<SeguridadPage />} />
                  <Route path="iperc" element={<IpercPage />} />
                  <Route path="charlas" element={<CharlasPage />} />
                  <Route path="incidentes" element={<IncidentesPage />} />
                  <Route path="inspecciones" element={<InspeccionesPage />} />
                  <Route path="condiciones" element={<CondicionesPage />} />
                  <Route path="historial" element={<HistorialSeguridadPage />} />
                </Route>

                <Route path="personal">
                  <Route index element={<PersonalPage />} />
                  <Route path=":id" element={<TrabajadorPage />} />
                </Route>

                <Route path="equipos">
                  <Route index element={<EquiposPage />} />
                  <Route path=":id" element={<EquipoDetallePage />} />
                </Route>

                <Route element={<RequirePermission permiso="produccion.ver" />}>
                  <Route path="produccion" element={<ProduccionPage />} />
                </Route>

                <Route path="mas">
                  <Route index element={<MasPage />} />
                  <Route path="biblioteca" element={<BibliotecaPage />} />
                  <Route element={<RequirePermission permiso="reportes.ver" />}>
                    <Route path="reportes" element={<ReportesPage />} />
                  </Route>
                  <Route element={<RequirePermission permiso="configuracion.administrar" />}>
                    <Route path="configuracion" element={<ConfiguracionPage />} />
                  </Route>
                  <Route element={<RequirePermission permiso="usuarios.administrar" />}>
                    <Route path="usuarios" element={<UsuariosPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
