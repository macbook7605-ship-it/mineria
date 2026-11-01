import type { ReactNode } from 'react';

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold tracking-widest text-ink-3 uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
