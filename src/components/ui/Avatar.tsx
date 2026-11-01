import { cx, initials } from '@/utils/format';

export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  return (
    <div
      className={cx(
        'grid shrink-0 place-items-center rounded-full bg-mina/15 font-bold text-mina ring-1 ring-mina/30',
        size === 'lg' ? 'size-16 text-xl' : 'size-11 text-sm',
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
