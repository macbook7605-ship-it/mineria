import type { ElementType, ReactNode } from 'react';

export function EmptyState({ icon: Icon, title, text, children }: { icon: ElementType; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-ink-3">
        <Icon className="size-8" aria-hidden />
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      {text && <p className="max-w-sm text-sm text-ink-2">{text}</p>}
      {children}
    </div>
  );
}
