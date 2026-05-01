import { Moon, Sun } from "lucide-react";
import { useAppState } from "../../store/AppStateContext.jsx";

export default function ThemeToggle() {
  const { state, actions } = useAppState();
  const isDark = state.theme === "dark";

  return (
    <button
      type="button"
      onClick={() => actions.setTheme(isDark ? "light" : "dark")}
      className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
    </button>
  );
}
