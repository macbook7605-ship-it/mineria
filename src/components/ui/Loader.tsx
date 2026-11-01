export function Loader() {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Cargando">
      <span className="size-8 animate-spin rounded-full border-4 border-line border-t-mina" />
    </div>
  );
}
