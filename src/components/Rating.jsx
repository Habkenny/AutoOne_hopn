import { Star } from "lucide-react";

export default function Rating({ value, count }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
      <Star aria-hidden="true" className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value}
      {count ? <span className="font-normal text-slate-500">({count})</span> : null}
    </span>
  );
}
