import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import FavoriteButton from "../components/common/FavoriteButton.jsx";
import Rating from "../components/Rating.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";
import { useServiceFeature } from "../hooks/useServiceFeature.js";
import { useCurrency } from "../hooks/useCurrency.js";
import { serviceTypes } from "../services/mockApi.js";

export default function ServiceDetail() {
  const { serviceType, serviceId } = useParams();
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();
  const service = serviceTypes[serviceType];
  const feature = useServiceFeature(serviceType);
  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", serviceType, serviceId],
    queryFn: () => feature.getProvider(serviceId),
    enabled: Boolean(service?.enabled && feature && serviceId),
  });

  if (!service?.enabled) {
    return <Navigate to="/services" replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <SkeletonCard />
      </div>
    );
  }

  if (!provider) {
    return <Navigate to={`/services/${serviceType}`} replace />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:pb-14">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <img
            src={provider.hero}
            alt={`${provider.name} workspace`}
            className="h-72 w-full rounded-3xl object-cover shadow-soft sm:h-[430px]"
          />
          <div className="grid grid-cols-3 gap-3">
            {provider.services.slice(0, 3).map((item) => (
              <div key={item} className="rounded-2xl bg-white p-3 text-center text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="surface h-max p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Rating value={provider.rating} count={provider.reviewCount} />
              <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                {provider.location} · {provider.distanceKm} km
              </span>
            </div>
            <FavoriteButton provider={provider} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{provider.name}</h1>
          <p className="mt-4 leading-8 text-slate-600">{provider.description}</p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">{t("detail.estimate")}</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {t("common.from")} {formatMoney(provider.priceFrom)}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-950">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-brand-600" />
              {t("detail.timeSlots")}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {provider.timeSlots.map((slot) => (
                <span key={slot} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700">
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <Button as="link" to={`/book/${provider.type}/${provider.id}`} className="mt-6 w-full">
            {t("common.book")}
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface p-6">
          <h2 className="text-xl font-bold text-slate-950">{t("detail.overview")}</h2>
          <ul className="mt-4 space-y-3">
            {provider.services.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-6">
          <h2 className="text-xl font-bold text-slate-950">{t("detail.reviews")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {provider.reviews.map((review) => (
              <article key={review.author} className="rounded-3xl bg-slate-50 p-4">
                <Rating value={review.rating} />
                <p className="mt-3 leading-7 text-slate-700">"{review.text}"</p>
                <p className="mt-3 text-sm font-bold text-slate-950">{review.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
