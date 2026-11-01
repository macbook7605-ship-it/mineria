import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-dvh pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <Outlet />
      <BottomNav />
    </div>
  );
}

/** Contenedor de contenido de página. */
export function Page({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-5">{children}</main>;
}
