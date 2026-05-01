export default function Input({ label, className = "", as = "input", ...props }) {
  const Component = as;

  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span> : null}
      <Component
        className={`focus-ring w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 placeholder:text-slate-400 ${className}`}
        {...props}
      />
    </label>
  );
}
