import { CheckCircle2, X, XCircle } from "lucide-react";
import { useAppState } from "../../store/AppStateContext.jsx";

export default function ToastHost() {
  const { state, actions } = useAppState();

  return (
    <div className="fixed end-4 top-20 z-[60] w-[calc(100%-2rem)] max-w-sm space-y-3">
      {state.toasts.map((toast) => {
        const Icon = toast.type === "error" ? XCircle : CheckCircle2;
        return (
          <div key={toast.id} className="surface flex items-start gap-3 p-4">
            <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 ${toast.type === "error" ? "text-rose-600" : "text-emerald-600"}`} />
            <div className="flex-1">
              <p className="font-bold text-slate-950">{toast.title}</p>
              {toast.message ? <p className="mt-1 text-sm text-slate-600">{toast.message}</p> : null}
            </div>
            <button type="button" onClick={() => actions.removeToast(toast.id)} className="focus-ring rounded-full p-1 text-slate-500" aria-label="Dismiss notification">
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
