import { Clock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../hooks/useCurrency.js";
import Button from "./Button.jsx";
import FavoriteButton from "./common/FavoriteButton.jsx";
import Rating from "./Rating.jsx";

export default function ServiceCard({ provider }) {
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();

  return (
    <article className="surface group relative overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute end-3 top-3 z-10">
        <FavoriteButton provider={provider} />
      </div>
      <img
        src={provider.hero}
        alt=""
        loading="lazy"
        className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />
      <div className="space-y-4 p-5">
        <div>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-950">{provider.name}</h3>
            <Rating value={provider.rating} />
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {provider.location} · {provider.distanceKm} km
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {provider.availableToday ? t("listing.openToday") : provider.timeSlots[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {t("common.from")}{" "}
            <span className="text-lg font-bold text-slate-950">{formatMoney(provider.priceFrom)}</span>
          </p>
          <Button as="link" to={`/services/${provider.type}/${provider.id}`}>
            {t("common.bookNow")}
          </Button>
        </div>
      </div>
    </article>
  );
}
