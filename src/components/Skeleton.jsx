export function SkeletonCard() {
  return (
    <div className="surface animate-pulse p-5">
      <div className="mb-4 h-36 rounded-2xl bg-slate-200" />
      <div className="mb-3 h-5 w-2/3 rounded bg-slate-200" />
      <div className="mb-2 h-4 w-full rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
    </div>
  );
}

export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
