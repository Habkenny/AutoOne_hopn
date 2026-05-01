import { Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppStateContext.jsx";
import { writeStorage } from "../utils/storage.js";

const languages = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "de", label: "DE" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { actions } = useAppState();

  function changeLanguage(language) {
    i18n.changeLanguage(language);
    writeStorage("autoone.language", language);
    actions.updateProfile({ language });
  }

  return (
    <label className="focus-within:ring-brand-500 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus-within:ring-2">
      <Globe2 aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">Language</span>
      <select
        value={i18n.language}
        onChange={(event) => changeLanguage(event.target.value)}
        className="bg-transparent outline-none"
        aria-label="Language"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
