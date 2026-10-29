import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { DEMO_PASSWORD } from '@/services/authService';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(usuario, password, recordar);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setEnviando(false);
    }
  }

  const field = 'h-14 w-full rounded-xl border border-line bg-surface-2 pl-12 text-base text-ink placeholder:text-ink-3 focus:border-mina focus:outline-none';

  return (
    <div className="pt-safe pb-safe relative flex min-h-dvh flex-col overflow-hidden">
      {/* franja de seguridad decorativa */}
      <div
        className="absolute inset-x-0 top-0 h-2 opacity-80"
        style={{ background: 'repeating-linear-gradient(135deg, var(--color-mina) 0 14px, var(--color-base) 14px 28px)' }}
        aria-hidden
      />
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 py-10">
        <div className="mb-10 flex justify-center">
          <Logo size="lg" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="usuario" className="mb-1.5 block text-sm font-semibold text-ink-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-3" aria-hidden />
              <input
                id="usuario"
                className={field}
                autoComplete="username"
                autoCapitalize="none"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingrese su usuario"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-3" aria-hidden />
              <input
                id="password"
                type={verPassword ? 'text' : 'password'}
                className={`${field} pr-14`}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setVerPassword((v) => !v)}
                className="absolute top-1/2 right-1 grid size-12 -translate-y-1/2 place-items-center rounded-lg text-ink-3 hover:text-ink"
                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {verPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <label className="flex min-h-12 cursor-pointer items-center gap-3 select-none">
            <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} className="size-5 accent-mina" />
            <span className="text-sm text-ink-2">Recordar sesión</span>
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" block icon={LogIn} disabled={enviando || !usuario || !password} className="h-14 text-lg">
            {enviando ? 'INGRESANDO…' : 'INICIAR SESIÓN'}
          </Button>
        </form>

        <div className="mt-8 rounded-xl border border-line bg-surface p-4 text-xs text-ink-3">
          <p className="mb-1 font-semibold text-ink-2">Modo demostración (Etapa 1)</p>
          <p>
            Usuarios: <code className="text-ink-2">admin</code>, <code className="text-ink-2">supervisor</code>,{' '}
            <code className="text-ink-2">juan</code> · Contraseña: <code className="text-ink-2">{DEMO_PASSWORD}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
