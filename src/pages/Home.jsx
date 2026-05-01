import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CarFront, Sparkles, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { SkeletonGrid } from "../components/Skeleton.jsx";
import { getFeaturedProviders } from "../services/mockApi.js";

export default function Home() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useQuery({
    queryKey: ["featured-providers"],
    queryFn: getFeaturedProviders,
  });

  return (
    <div className="pb-28 md:pb-14">
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
            {t("home.eyebrow")}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t("home.subtitle")}</p>

          <div className="mt-8">
            <SearchBar />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button as="link" to="/services/workshops" className="justify-between">
              <span className="inline-flex items-center gap-2">
                <Wrench aria-hidden="true" className="h-5 w-5" />
                {t("home.workshopAction")}
              </span>
              <ArrowRight aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
            </Button>
            <Button as="link" to="/services/carwash" variant="secondary" className="justify-between">
              <span className="inline-flex items-center gap-2">
                <CarFront aria-hidden="true" className="h-5 w-5" />
                {t("home.carwashAction")}
              </span>
              <ArrowRight aria-hidden="true" className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        <div className="surface relative overflow-hidden p-5">
          <div className="absolute end-6 top-6 rounded-full bg-white/90 p-3 text-brand-700 shadow-lg">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
            alt="Modern car service bay"
            className="h-72 w-full rounded-3xl object-cover sm:h-96"
          />
          <div className="-mt-16 ms-4 max-w-xs rounded-3xl bg-white/95 p-5 shadow-soft backdrop-blur">
            <p className="text-sm font-semibold text-slate-500">{t("home.popular")}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950">4.8 ★</p>
            <p className="text-sm text-slate-600">{t("home.heroRatingText")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-slate-950">{t("home.featured")}</h2>
          <Button as="link" to="/services" variant="ghost">
            {t("nav.services")}
          </Button>
        </div>
        {isLoading ? <SkeletonGrid /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
