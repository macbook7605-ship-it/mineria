import type { ButtonHTMLAttributes, ElementType } from 'react';
import { cx } from '@/utils/format';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-mina text-mina-ink hover:bg-mina-strong active:bg-mina',
  secondary: 'bg-surface-2 text-ink border border-line hover:border-ink-3',
  danger: 'bg-danger text-white hover:brightness-110',
  ghost: 'text-ink-2 hover:text-ink hover:bg-surface-2',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ElementType;
  block?: boolean;
}

/** Botón grande (mín. 52 px de alto) pensado para uso con guantes. */
export function Button({ variant = 'primary', icon: Icon, block, className, children, ...props }: Props) {
  return (
    <button
      className={cx(
        'inline-flex min-h-13 items-center justify-center gap-2 rounded-xl px-5 text-base font-bold tracking-wide transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        block && 'w-full',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-5" aria-hidden />}
      {children}
    </button>
  );
}
