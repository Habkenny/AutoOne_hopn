import { BarChart3, BriefcaseBusiness, Car, Home, LogIn, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import AIAssistant from "../components/AIAssistant.jsx";
import CurrencySwitcher from "../components/common/CurrencySwitcher.jsx";
import NotificationBell from "../components/common/NotificationBell.jsx";
import PreferencesDrawer from "../components/common/PreferencesDrawer.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";
import ToastHost from "../components/ui/ToastHost.jsx";
import { useAppState } from "../store/AppStateContext.jsx";

const navItems = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/services", labelKey: "nav.services", icon: Wrench },
  { to: "/dashboard", labelKey: "nav.dashboard", icon: BarChart3 },
  { to: "/partner", labelKey: "nav.partner", icon: BriefcaseBusiness },
];

export default function MainLayout() {
  const { t } = useTranslation();
  const { state, actions } = useAppState();

  return (
    <div className="app-shell min-h-screen transition-colors">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" className="focus-ring inline-flex items-center gap-2 rounded-2xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
              <Car aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-950">AutoOne</span>
          </NavLink>

          <div className="hidden items-center gap-1 rounded-2xl bg-slate-100 p-1 md:flex">
            {navItems.map(({ to, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `focus-ring rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-950"
                  }`
                }
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <div className="hidden sm:block">
              <CurrencySwitcher />
            </div>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <PreferencesDrawer />
            {state.auth.isAuthenticated ? (
              <button
                type="button"
                onClick={actions.logout}
                className="focus-ring hidden rounded-2xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 md:inline-flex"
              >
                {t("auth.logout")}
              </button>
            ) : (
              <NavLink
                to="/login"
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 md:w-auto md:px-4 md:text-sm md:font-bold"
              >
                <LogIn aria-hidden="true" className="h-5 w-5 md:me-2" />
                <span className="hidden md:inline">{t("auth.login")}</span>
              </NavLink>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden"
        aria-label="Primary"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `focus-ring flex flex-col items-center rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-500"
                }`
              }
            >
              <Icon aria-hidden="true" className="mb-1 h-5 w-5" />
              {t(labelKey)}
            </NavLink>
          ))}
        </div>
      </nav>

      <AIAssistant />
      <ToastHost />
    </div>
  );
}
