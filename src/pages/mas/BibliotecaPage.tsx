import { FileText, Plus, Star } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';
import { StageNotice } from '@/components/ui/StageNotice';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { getCharlaDelDia, getCharlas } from '@/services/dataService';
import { formatDate } from '@/utils/date';

export default function BibliotecaPage() {
  const { can } = useAuth();
  const { data, loading } = useAsync(async () => {
    const [charlas, delDia] = await Promise.all([getCharlas(), getCharlaDelDia()]);
    return { charlas, delDiaId: delDia.charla?.id };
  });

  return (
    <>
      <PageHeader title="Biblioteca de charlas" back />
      <Page>
        {can('charlas.subir') && (
          <>
            <Button block icon={Plus} disabled>
              SUBIR NUEVA CHARLA
            </Button>
            <StageNotice etapa={3}>La subida de PDF a almacenamiento privado y la selección de la charla del día se habilitan en la Etapa 3.</StageNotice>
          </>
        )}
        {loading || !data ? (
          <Loader />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.charlas.map((c) => (
              <Card key={c.id} className="flex gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-danger/12 text-danger">
                  <FileText className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{c.titulo}</p>
                    {c.id === data.delDiaId && (
                      <Badge tone="warn">
                        <Star className="size-3" aria-hidden /> Charla del día
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-ink-2">{c.descripcion}</p>
                  <p className="text-xs text-ink-3">
                    {c.categoria} · Creada el {formatDate(c.fecha_creacion)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
