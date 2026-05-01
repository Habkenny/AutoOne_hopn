import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import { providers } from "../services/mockApi.js";
import { readStorage, writeStorage } from "../utils/storage.js";

export default function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [service, setService] = useState("workshops");
  const [recent, setRecent] = useState(() => readStorage("autoone.recentSearches", []));

  const suggestions = useMemo(() => {
    const term = location.trim().toLowerCase();
    const locations = [...new Set(providers.map((provider) => provider.location))];
    const serviceNames = [...new Set(providers.flatMap((provider) => provider.services))];
    return [...locations, ...serviceNames]
      .filter((item) => !term || item.toLowerCase().includes(term))
      .slice(0, 5);
  }, [location]);

  function handleSubmit(event) {
    event.preventDefault();
    const query = location.trim() ? `?location=${encodeURIComponent(location.trim())}` : "";
    if (location.trim()) {
      const nextRecent = [location.trim(), ...recent.filter((item) => item !== location.trim())].slice(0, 4);
      setRecent(nextRecent);
      writeStorage("autoone.recentSearches", nextRecent);
    }
    navigate(`/services/${service}${query}`);
  }

  return (
    <form onSubmit={handleSubmit} className="surface p-3" aria-label="Service search">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-slate-50 px-4">
          <Search aria-hidden="true" className="h-5 w-5 text-slate-400" />
          <span className="sr-only">{t("common.location")}</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder={t("home.locationPlaceholder")}
            className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
            list="autoone-search-suggestions"
          />
          <datalist id="autoone-search-suggestions">
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </label>

        <label className="rounded-2xl bg-slate-50 px-4">
          <span className="sr-only">{t("home.servicePlaceholder")}</span>
          <select
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="h-12 w-full bg-transparent font-semibold text-slate-800 outline-none"
          >
            <option value="workshops">{t("services.workshops")}</option>
            <option value="carwash">{t("services.carwash")}</option>
          </select>
        </label>

        <Button type="submit" className="w-full sm:w-auto">
          {t("home.search")}
        </Button>
      </div>

      {recent.length ? (
        <div className="mt-3 flex flex-wrap gap-2 px-1">
          {recent.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLocation(item)}
              className="focus-ring rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
