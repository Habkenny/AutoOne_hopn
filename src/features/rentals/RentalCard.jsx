import { CalendarDays, MapPin } from "lucide-react";
import Button from "../../components/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Rating from "../../components/Rating.jsx";
import { useCurrency } from "../../hooks/useCurrency.js";

export default function RentalCard({ car }) {
  const { formatMoney } = useCurrency();

  return (
    <Card as="article" className="overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <img src={car.images[0]} alt={car.model} className="h-48 w-full object-cover" loading="lazy" />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{car.model}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {car.location} · {car.type}
            </p>
          </div>
          <Rating value={car.rating} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            <span className="text-2xl font-extrabold text-slate-950">{formatMoney(car.pricePerDay)}</span> / day
          </p>
          <Badge tone={car.available ? "confirmed" : "cancelled"}>
            {car.available ? "Available" : "Booked"}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            Flexible pickup
          </span>
          <Button as="link" to={`/services/rentals/${car.id}`} variant="secondary">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
