const tones = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-blue-50 text-blue-700 ring-blue-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Badge({ tone = "neutral", children }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${tones[tone] ?? tones.neutral}`}>
      {children}
    </span>
  );
}
