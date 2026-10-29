import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '@/utils/format';
import type { Tone } from './Badge';

const ICON_TONE: Record<Tone, string> = {
  ok: 'text-ok bg-ok/12',
  warn: 'text-warn bg-warn/12',
  danger: 'text-danger bg-danger/12',
  info: 'text-info bg-info/12',
  neutral: 'text-mina bg-mina/12',
};

interface Props {
  icon: ElementType;
  label: string;
  value: string | number;
  detail?: string;
  tone?: Tone;
  to?: string;
}

export function StatCard({ icon: Icon, label, value, detail, tone = 'neutral', to }: Props) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="text-3xl leading-none font-extrabold tabular-nums">{value}</div>
        <div className={cx('grid size-9 shrink-0 place-items-center rounded-xl', ICON_TONE[tone])}>
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
      <div className="mt-1.5 text-sm font-medium text-ink-2">{label}</div>
      {detail && <div className="mt-0.5 text-xs text-ink-3">{detail}</div>}
    </>
  );
  const cls = 'block rounded-2xl border border-line bg-surface p-4';
  return to ? (
    <Link to={to} className={cx(cls, 'transition hover:border-ink-3 active:bg-surface-2')}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
