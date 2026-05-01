import { useQuery } from "@tanstack/react-query";
import { CarFront, CreditCard, KeyRound, PackageSearch, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getServiceTypes } from "../services/mockApi.js";

const icons = {
  workshops: Wrench,
  carwash: CarFront,
  rentals: KeyRound,
  imports: PackageSearch,
  financing: CreditCard,
};

export default function Services() {
  const { t } = useTranslation();
  const { data = [] } = useQuery({
    queryKey: ["service-types"],
    queryFn: getServiceTypes,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-10 md:pb-14">
      <section className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
          AutoOne
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">{t("services.title")}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{t("services.subtitle")}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Available services">
        {data.map((service) => {
          const Icon = icons[service.id];
          const content = (
            <article className="surface h-full p-5 transition hover:-translate-y-1 hover:shadow-xl">
              <div className={`mb-5 inline-flex rounded-2xl p-3 ${service.accent}`}>
                <Icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950">{t(service.labelKey)}</h2>
                {service.beta ? (
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                    Beta
                  </span>
                ) : null}
                {!service.enabled ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    {t("common.comingSoon")}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 leading-7 text-slate-600">{t(service.descriptionKey)}</p>
            </article>
          );

          return service.enabled ? (
            <Link key={service.id} to={`/services/${service.id}`} className="focus-ring rounded-3xl">
              {content}
            </Link>
          ) : (
            <div key={service.id} aria-disabled="true" className="opacity-75">
              {content}
            </div>
          );
        })}
      </section>
    </div>
  );
}
