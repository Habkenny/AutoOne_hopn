import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { SkeletonGrid } from "../components/ui/Loader.jsx";
import RentalCard from "../features/rentals/RentalCard.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { getRentalCars } from "../services/mockApi.js";

export default function Rentals() {
  const { formatMoney } = useCurrency();
  const [filters, setFilters] = useState({
    location: "",
    startDate: "",
    endDate: "",
    type: "all",
    maxPrice: 160,
  });

  const queryFilters = useMemo(() => filters, [filters]);
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["rentals", queryFilters],
    queryFn: () => getRentalCars(queryFilters),
  });

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne Rentals Beta</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Rent the right car for every trip.</h1>
        <p className="mt-4 leading-8 text-slate-600">
          Search available vehicles, compare daily pricing, and complete a simulated booking with extras.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="surface h-max p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-950">
            <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-brand-600" />
            Search & filters
          </h2>
          <div className="space-y-4">
            <Input label="Location" value={filters.location} placeholder="Downtown" onChange={(event) => updateFilter("location", event.target.value)} />
            <Input label="Pickup date" type="date" value={filters.startDate} onChange={(event) => updateFilter("startDate", event.target.value)} />
            <Input label="Return date" type="date" value={filters.endDate} onChange={(event) => updateFilter("endDate", event.target.value)} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Car type</span>
              <select
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
                className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white px-4"
              >
                <option value="all">All cars</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Luxury">Luxury</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Max price: {formatMoney(filters.maxPrice)}/day</span>
              <input
                type="range"
                min="40"
                max="180"
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
                className="w-full accent-brand-600"
              />
            </label>
          </div>
        </aside>

        <section aria-live="polite">
          {isLoading ? <SkeletonGrid count={4} /> : null}
          {isError ? (
            <div className="surface p-8 text-center">
              <p className="font-bold text-slate-950">Unable to load rental cars.</p>
              <Button type="button" onClick={() => refetch()} className="mt-4">Retry</Button>
            </div>
          ) : null}
          {!isLoading && !isError && data.length === 0 ? (
            <div className="surface p-8 text-center">
              <p className="font-bold text-slate-700">No cars match your filters yet.</p>
            </div>
          ) : null}
          {!isLoading && !isError && data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((car) => <RentalCard key={car.id} car={car} />)}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
