import type { ElementType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cx } from '@/utils/format';

interface Props {
  to?: string;
  icon?: ElementType;
  iconClass?: string;
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
}

/** Fila de lista táctil (mín. 64 px). Si tiene `to`, navega. */
export function ListRow({ to, icon: Icon, iconClass, leading, title, subtitle, trailing }: Props) {
  const body = (
    <>
      {leading ??
        (Icon && (
          <div className={cx('grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2', iconClass ?? 'text-mina')}>
            <Icon className="size-5" aria-hidden />
          </div>
        ))}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{title}</div>
        {subtitle && <div className="truncate text-sm text-ink-2">{subtitle}</div>}
      </div>
      {trailing}
      {to && <ChevronRight className="size-5 shrink-0 text-ink-3" aria-hidden />}
    </>
  );
  const cls = 'flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-3';
  return to ? (
    <Link to={to} className={cx(cls, 'transition hover:border-ink-3 active:bg-surface-2')}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
