import { SkeletonCard, SkeletonGrid } from "../Skeleton.jsx";

export { SkeletonCard, SkeletonGrid };

export default function Loader({ label = "Loading" }) {
  return (
    <div className="surface flex min-h-40 items-center justify-center p-6" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
