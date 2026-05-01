import { Heart } from "lucide-react";
import { useAppState } from "../../store/AppStateContext.jsx";

export default function FavoriteButton({ provider, className = "" }) {
  const { state, actions } = useAppState();
  const saved = state.favorites.some((item) => item.id === provider.id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        actions.toggleFavorite({
          id: provider.id,
          type: provider.type,
          name: provider.name,
          location: provider.location,
          rating: provider.rating,
          priceFrom: provider.priceFrom,
          hero: provider.hero,
        });
        actions.addToast({
          title: saved ? "Removed from saved services" : "Saved service",
          message: provider.name,
        });
      }}
      className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow transition hover:scale-105 ${saved ? "text-rose-600" : ""} ${className}`}
      aria-label={saved ? "Remove saved service" : "Save service"}
    >
      <Heart aria-hidden="true" className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
