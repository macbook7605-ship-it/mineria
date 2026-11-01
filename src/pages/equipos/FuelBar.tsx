import { cx } from '@/utils/format';

/** Indicador de combustible: rojo < 25 %, amarillo < 50 %, verde en otro caso. */
export function FuelBar({ value }: { value: number }) {
  const color = value < 25 ? 'bg-danger' : value < 50 ? 'bg-warn' : 'bg-ok';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Combustible">
        <div className={cx('h-full rounded-full', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right text-sm font-semibold tabular-nums">{value}%</span>
    </div>
  );
}
