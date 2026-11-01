import { cx } from '@/utils/format';

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

const TONES: Record<Tone, string> = {
  ok: 'bg-ok/15 text-ok ring-ok/30',
  warn: 'bg-warn/15 text-warn ring-warn/30',
  danger: 'bg-danger/15 text-danger ring-danger/30',
  info: 'bg-info/15 text-info ring-info/30',
  neutral: 'bg-surface-2 text-ink-2 ring-line',
};

const DOT: Record<Tone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  danger: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-ink-3',
};

/** Estado siempre con texto + punto de color (nunca solo color). */
export function Badge({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      <span className={cx('size-1.5 rounded-full', DOT[tone])} aria-hidden />
      {children}
    </span>
  );
}
