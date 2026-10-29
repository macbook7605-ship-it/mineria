import type { HTMLAttributes } from 'react';
import { cx } from '@/utils/format';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('rounded-2xl border border-line bg-surface p-4', className)} {...props} />;
}
