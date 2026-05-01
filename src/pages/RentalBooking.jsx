import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import StepIndicator from "../components/StepIndicator.jsx";
import Input from "../components/ui/Input.jsx";
import Loader from "../components/ui/Loader.jsx";
import { rentalExtras } from "../features/rentals/rentalsData.js";
import { useMarketplace } from "../features/shared/MarketplaceContext.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { createRentalBooking, getRentalCarById } from "../services/mockApi.js";
import { useAppState } from "../store/AppStateContext.jsx";

export default function RentalBooking() {
  const { rentalId } = useParams();
  const { actions: appActions } = useAppState();
  const { state, actions } = useMarketplace();
  const { formatMoney } = useCurrency();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const { data: car, isLoading } = useQuery({
    queryKey: ["rental-booking", rentalId],
    queryFn: () => getRentalCarById(rentalId),
  });

  const mutation = useMutation({
    mutationFn: createRentalBooking,
    onSuccess: (result) => {
      appActions.addBooking({
        id: result.id,
        providerId: car.id,
        providerName: car.model,
        serviceType: "rentals",
        date: state.rentalBooking.startDate,
        time: "Pickup",
        car: car.model,
        price: total,
        status: "pending",
      });
      appActions.addToast({ title: "Rental request sent", message: car.model });
      setSuccess(true);
    },
  });

  const days = useMemo(() => {
    if (!state.rentalBooking.startDate || !state.rentalBooking.endDate) return 1;
    const start = new Date(state.rentalBooking.startDate);
    const end = new Date(state.rentalBooking.endDate);
    return Math.max(1, Math.ceil((end - start) / 86400000));
  }, [state.rentalBooking.endDate, state.rentalBooking.startDate]);

  const extrasTotal = state.rentalBooking.extras.reduce((sum, id) => {
    const extra = rentalExtras.find((item) => item.id === id);
    return sum + (extra?.price ?? 0) * days;
  }, 0);
  const total = car ? car.pricePerDay * days + extrasTotal + car.deposit : 0;

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-10"><Loader /></div>;
  if (!car) return <Navigate to="/services/rentals" replace />;

  function toggleExtra(id) {
    const extras = state.rentalBooking.extras.includes(id)
      ? state.rentalBooking.extras.filter((item) => item !== id)
      : [...state.rentalBooking.extras, id];
    actions.updateRentalBooking({ extras });
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-12 md:pb-14">
        <section className="surface p-8 text-center">
          <CheckCircle2 aria-hidden="true" className="mx-auto mb-4 h-14 w-14 text-emerald-600" />
          <h1 className="text-3xl font-extrabold text-slate-950">Rental booking submitted</h1>
          <p className="mt-3 text-slate-600">This frontend simulation saved the booking locally.</p>
          <Button as="link" to="/dashboard" className="mt-6">View dashboard</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-8 md:pb-14">
      <section className="surface p-5 sm:p-6">
        <h1 className="mb-5 text-3xl font-extrabold text-slate-950">Book {car.model}</h1>
        <StepIndicator steps={["Dates", "Extras", "Confirm"]} currentStep={step} />

        <div className="mt-8">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Pickup date" type="date" value={state.rentalBooking.startDate} onChange={(event) => actions.updateRentalBooking({ carId: car.id, startDate: event.target.value })} />
              <Input label="Return date" type="date" value={state.rentalBooking.endDate} onChange={(event) => actions.updateRentalBooking({ endDate: event.target.value })} />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-3">
              {rentalExtras.map((extra) => (
                <label key={extra.id} className="flex cursor-pointer items-center justify-between rounded-3xl border border-slate-200 p-4">
                  <span>
                    <span className="block font-bold text-slate-950">{extra.label}</span>
                    <span className="text-sm text-slate-500">{formatMoney(extra.price)}/day</span>
                  </span>
                  <input type="checkbox" checked={state.rentalBooking.extras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} className="h-5 w-5 accent-brand-600" />
                </label>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <dl className="rounded-3xl bg-slate-50 p-5">
              <Summary label="Vehicle" value={car.model} />
              <Summary label="Rental days" value={days} />
              <Summary label="Extras" value={state.rentalBooking.extras.length || "None"} />
              <Summary label="Deposit" value={formatMoney(car.deposit)} />
              <Summary label="Total due estimate" value={formatMoney(total)} strong />
            </dl>
          ) : null}
        </div>

        <div className="sticky bottom-24 z-20 -mx-2 mt-8 flex justify-between gap-3 rounded-3xl bg-white/95 p-2 shadow-soft backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0 md:shadow-none">
          <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</Button>
          <Button
            type="button"
            disabled={mutation.isPending || (step === 0 && (!state.rentalBooking.startDate || !state.rentalBooking.endDate))}
            onClick={() => {
              if (step === 2) mutation.mutate({ carId: car.id, ...state.rentalBooking, total });
              else setStep((value) => value + 1);
            }}
          >
            {step === 2 ? "Confirm rental" : "Next"}
          </Button>
        </div>
      </section>
    </div>
  );
}

function Summary({ label, value, strong }) {
  return (
    <div className="mb-3 flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className={strong ? "font-extrabold text-slate-950" : "font-bold text-slate-800"}>{value}</dd>
    </div>
  );
}
