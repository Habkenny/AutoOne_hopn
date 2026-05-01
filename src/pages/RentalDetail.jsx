import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Fuel, Gauge, UsersRound } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Rating from "../components/Rating.jsx";
import Badge from "../components/ui/Badge.jsx";
import Loader from "../components/ui/Loader.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { getRentalCarById } from "../services/mockApi.js";

export default function RentalDetail() {
  const { rentalId } = useParams();
  const { formatMoney } = useCurrency();
  const { data: car, isLoading } = useQuery({
    queryKey: ["rental", rentalId],
    queryFn: () => getRentalCarById(rentalId),
  });

  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-10"><Loader /></div>;
  }

  if (!car) {
    return <Navigate to="/services/rentals" replace />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:pb-14">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <img src={car.images[0]} alt={car.model} className="h-72 w-full rounded-3xl object-cover shadow-soft sm:h-[430px]" />
          <div className="grid grid-cols-2 gap-3">
            {car.images.map((image) => (
              <img key={image} src={image} alt="" className="h-28 w-full rounded-2xl object-cover" loading="lazy" />
            ))}
          </div>
        </div>

        <div className="surface h-max p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Rating value={car.rating} />
            <Badge tone={car.available ? "confirmed" : "cancelled"}>{car.available ? "Available" : "Booked"}</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950">{car.model}</h1>
          <p className="mt-3 text-slate-600">{car.location} · {car.type}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Spec icon={UsersRound} label={`${car.seats} seats`} />
            <Spec icon={Gauge} label={car.transmission} />
            <Spec icon={Fuel} label={car.fuel} />
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <h2 className="font-bold text-slate-950">Pricing breakdown</h2>
            <Line label="Daily rate" value={formatMoney(car.pricePerDay)} />
            <Line label="Refundable deposit" value={formatMoney(car.deposit)} />
            <Line label="Estimated 3-day total" value={formatMoney(car.pricePerDay * 3 + car.deposit)} strong />
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-bold text-slate-950">Availability calendar</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, index) => (
                <span key={index} className={`rounded-2xl p-2 text-center text-xs font-bold ${index % 6 === 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {index + 1}
                </span>
              ))}
            </div>
          </div>

          {car.available ? (
            <Button as="link" to={`/services/rentals/${car.id}/book`} className="mt-6 w-full">
              Book rental
            </Button>
          ) : (
            <Button type="button" className="mt-6 w-full opacity-60" disabled>
              Currently unavailable
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function Spec({ icon: Icon, label }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <Icon aria-hidden="true" className="mx-auto mb-2 h-5 w-5 text-brand-600" />
      <p className="text-xs font-bold text-slate-700">{label}</p>
    </div>
  );
}

function Line({ label, value, strong }) {
  return (
    <div className="mt-3 flex justify-between gap-4 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={strong ? "font-extrabold text-slate-950" : "font-bold text-slate-800"}>{value}</span>
    </div>
  );
}
