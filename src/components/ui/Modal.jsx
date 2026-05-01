import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="surface max-h-[90vh] w-full max-w-xl overflow-y-auto">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
          <h2 id="modal-title" className="text-xl font-bold text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="focus-ring rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close modal">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
