import { Construction } from 'lucide-react';

/** Aviso honesto de funciones que se habilitan en etapas posteriores. */
export function StageNotice({ etapa, children }: { etapa: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-info/30 bg-info/10 p-3 text-sm text-ink-2">
      <Construction className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
      <p>
        <span className="font-semibold text-ink">Etapa {etapa}.</span> {children}
      </p>
    </div>
  );
}
