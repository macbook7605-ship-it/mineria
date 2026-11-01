import { cx } from '@/utils/format';

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <div className="flex items-center gap-3">
      <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className={lg ? 'size-16' : 'size-10'} />
      <div className="leading-none">
        <div className={cx('font-extrabold tracking-tight', lg ? 'text-3xl' : 'text-lg')}>
          MINERÍA <span className="text-mina">CONTROL</span>
        </div>
        {lg && <div className="mt-1.5 text-xs font-semibold tracking-[0.25em] text-ink-3 uppercase">Seguridad · Operación</div>}
      </div>
    </div>
  );
}
