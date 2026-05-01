import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard.jsx";
import { SkeletonGrid } from "../components/Skeleton.jsx";
import { useServiceFeature } from "../hooks/useServiceFeature.js";
import { serviceTypes } from "../services/mockApi.js";

export default function Listing() {
  const { serviceType } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const service = serviceTypes[serviceType];
  const feature = useServiceFeature(serviceType);
  const [filters, setFilters] = useState({
    location: searchParams.get("location") ?? "",
    maxPrice: "",
    minRating: "",
    availableToday: false,
  });

  const queryFilters = useMemo(() => filters, [filters]);
  const { data = [], isLoading } = useQuery({
    queryKey: ["providers", serviceType, queryFilters],
    queryFn: () => feature.listProviders(queryFilters),
    enabled: Boolean(service?.enabled && feature),
  });

  if (!service?.enabled) {
    return <Navigate to="/services" replace />;
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {t("listing.title", { service: t(service.labelKey) })}
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">{t("listing.subtitle")}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="surface h-max p-5" aria-label={t("listing.filters")}>
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-brand-600" />
            <h2 className="font-bold text-slate-950">{t("listing.filters")}</h2>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t("common.location")}</span>
              <input
                value={filters.location}
                onChange={(event) => updateFilter("location", event.target.value)}
                className="focus-ring h-11 w-full rounded-2xl border border-slate-200 bg-white px-4"
                placeholder="Downtown"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t("listing.maxPrice")}</span>
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
                className="focus-ring h-11 w-full rounded-2xl border border-slate-200 bg-white px-4"
                placeholder="50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{t("listing.minRating")}</span>
              <select
                value={filters.minRating}
                onChange={(event) => updateFilter("minRating", event.target.value)}
                className="focus-ring h-11 w-full rounded-2xl border border-slate-200 bg-white px-4"
              >
                <option value="">{t("common.all")}</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.9">4.9+</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filters.availableToday}
                onChange={(event) => updateFilter("availableToday", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600"
              />
              {t("listing.openToday")}
            </label>
          </div>
        </aside>

        <section aria-live="polite">
          {isLoading ? <SkeletonGrid /> : null}
          {!isLoading && data.length === 0 ? (
            <div className="surface p-8 text-center">
              <p className="font-semibold text-slate-700">{t("listing.noResults")}</p>
            </div>
          ) : null}
          {!isLoading && data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((provider) => (
                <ServiceCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
