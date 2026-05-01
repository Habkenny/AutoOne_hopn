import { LogIn, Settings, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppState } from "../../store/AppStateContext.jsx";
import CurrencySwitcher from "./CurrencySwitcher.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageSwitcher from "../LanguageSwitcher.jsx";

export default function PreferencesDrawer() {
  const { t } = useTranslation();
  const { state, actions } = useAppState();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
        aria-label={t("common.preferences")}
      >
        <Settings aria-hidden="true" className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm md:hidden" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
          <div className="surface fixed inset-x-3 bottom-3 rounded-4xl p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne</p>
                <h2 id="preferences-title" className="mt-1 text-2xl font-extrabold text-slate-950">
                  {t("common.preferences")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close preferences"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3">
              <PreferenceRow label={t("common.theme")}>
                <ThemeToggle />
              </PreferenceRow>
              <PreferenceRow label={t("common.currency")}>
                <CurrencySwitcher />
              </PreferenceRow>
              <PreferenceRow label={t("common.language")}>
                <LanguageSwitcher />
              </PreferenceRow>

              {state.auth.isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    actions.logout();
                    setOpen(false);
                  }}
                  className="focus-ring mt-2 min-h-12 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"
                >
                  {t("auth.logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="focus-ring mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-bold text-white"
                >
                  <LogIn aria-hidden="true" className="h-5 w-5" />
                  {t("auth.login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PreferenceRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-3">
      <span className="font-bold text-slate-700">{label}</span>
      {children}
    </div>
  );
}
