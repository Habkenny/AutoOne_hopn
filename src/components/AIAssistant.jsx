import { Bot, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button.jsx";

export default function AIAssistant() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const prompts = [t("ai.promptCheap"), t("ai.promptCarwash")];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring fixed bottom-40 inset-e-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-2xl transition hover:-translate-y-1 hover:bg-brand-700 md:bottom-5"
        aria-label={t("ai.label")}
      >
        <MessageCircle aria-hidden="true" className="h-6 w-6" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 px-4 py-6 backdrop-blur-sm sm:flex sm:items-end sm:justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-title"
        >
          <div className="surface ms-auto flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <div className="mb-2 inline-flex rounded-2xl bg-brand-50 p-2 text-brand-700">
                  <Bot aria-hidden="true" className="h-5 w-5" />
                </div>
                <h2 id="ai-title" className="text-xl font-bold text-slate-950">
                  {t("ai.title")}
                </h2>
                <p className="text-sm text-slate-500">{t("ai.subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close assistant"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-5">
              {prompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => setMessage(t("ai.response"))}
                >
                  {prompt}
                </Button>
              ))}

              {message ? (
                <div className="rounded-3xl bg-slate-100 p-4 text-sm leading-6 text-slate-700">
                  {message}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
