import { UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { ListRow } from '@/components/ui/ListRow';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { StageNotice } from '@/components/ui/StageNotice';
import { useAsync } from '@/hooks/useAsync';
import { getPerfiles } from '@/services/dataService';
import { ROL_LABEL } from '@/auth/permissions';
import type { Rol } from '@/database/types';

const TONO_ROL: Record<Rol, 'warn' | 'info' | 'neutral'> = { administrador: 'warn', supervisor: 'info', trabajador: 'neutral' };

export default function UsuariosPage() {
  const { data, loading } = useAsync(getPerfiles);
  return (
    <>
      <PageHeader title="Usuarios" back />
      <Page>
        <Button block icon={UserPlus} disabled>
          NUEVO USUARIO
        </Button>
        <StageNotice etapa={2}>La creación de usuarios, roles y contraseñas se habilita con Supabase Auth.</StageNotice>
        {loading || !data ? (
          <Loader />
        ) : (
          <div className="space-y-2">
            {data.map((u) => (
              <ListRow
                key={u.id}
                leading={<Avatar name={u.nombre} />}
                title={u.nombre}
                subtitle={`@${u.usuario} · ${u.cargo}`}
                trailing={<Badge tone={TONO_ROL[u.rol]}>{ROL_LABEL[u.rol]}</Badge>}
              />
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
