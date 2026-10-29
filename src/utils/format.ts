export const formatNumber = (n: number, decimals = 0) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
