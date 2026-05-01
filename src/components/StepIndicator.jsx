export default function StepIndicator({ steps, currentStep }) {
  return (
    <ol
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;

        return (
          <li key={step} className="min-w-0">
            <div
              className={`h-2 rounded-full transition ${
                isDone || isActive ? "bg-brand-600" : "bg-slate-200"
              }`}
            />
            <p
              className={`mt-2 truncate text-xs font-semibold ${
                isActive ? "text-brand-700" : "text-slate-500"
              }`}
            >
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
