import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Ship } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import StepIndicator from "../components/StepIndicator.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import Loader from "../components/ui/Loader.jsx";
import { importTimeline } from "../features/imports/importsData.js";
import { useMarketplace } from "../features/shared/MarketplaceContext.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { createImportRequest, getImportCatalog } from "../services/mockApi.js";
import { useAppState } from "../store/AppStateContext.jsx";

export default function Imports() {
  const { state, actions } = useMarketplace();
  const { actions: appActions } = useAppState();
  const { formatMoney } = useCurrency();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const request = state.importRequest;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["import-catalog", request.region],
    queryFn: () => getImportCatalog(request.region),
  });

  const selectedCar = useMemo(
    () => data?.cars.find((car) => car.id === request.carId) ?? data?.cars[0],
    [data?.cars, request.carId]
  );
  const selectedRegion = data?.regions.find((region) => region.id === request.region);
  const costs = useMemo(() => {
    if (!selectedCar || !selectedRegion) return { customs: 0, total: 0 };
    const customs = Math.round(selectedCar.price * selectedRegion.customsRate);
    return {
      car: selectedCar.price,
      shipping: selectedRegion.shipping,
      customs,
      total: selectedCar.price + selectedRegion.shipping + customs,
    };
  }, [selectedCar, selectedRegion]);

  const mutation = useMutation({
    mutationFn: createImportRequest,
    onSuccess: () => {
      setSubmitted(true);
      appActions.addToast({ title: "Import request submitted", message: selectedCar?.model });
    },
  });

  if (isLoading) return <div className="mx-auto max-w-5xl px-4 py-10"><Loader /></div>;

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <section className="surface p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-950">Unable to load import catalog</h1>
          <Button type="button" onClick={() => refetch()} className="mt-5">Retry</Button>
        </section>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-8 md:pb-14">
        <section className="surface p-8">
          <CheckCircle2 aria-hidden="true" className="mb-4 h-14 w-14 text-emerald-600" />
          <h1 className="text-3xl font-extrabold text-slate-950">Import request received</h1>
          <p className="mt-3 text-slate-600">Track the simulated import timeline below while backend integration is pending.</p>
          <Timeline />
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne Imports Beta</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Import a car with transparent costs.</h1>
        <p className="mt-4 leading-8 text-slate-600">A guided frontend simulation for region, vehicle, shipping, customs, and delivery timeline.</p>
      </section>

      <section className="surface p-5 sm:p-6">
        <StepIndicator steps={["Region", "Car", "Shipping", "Cost"]} currentStep={step} />

        <div className="mt-8">
          {step === 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {data.regions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => actions.updateImportRequest({ region: region.id, carId: "" })}
                  className={`focus-ring rounded-3xl border p-5 text-start transition ${
                    request.region === region.id ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <h2 className="font-bold text-slate-950">{region.label}</h2>
                  <p className="mt-2 text-sm text-slate-600">ETA {region.eta}</p>
                  <p className="mt-2 text-sm font-bold text-brand-700">{formatMoney(region.shipping)} shipping</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.cars.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => actions.updateImportRequest({ carId: car.id })}
                  className={`focus-ring overflow-hidden rounded-3xl border text-start transition ${
                    selectedCar?.id === car.id ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <img src={car.image} alt={car.model} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h2 className="font-bold text-slate-950">{car.model}</h2>
                    <p className="mt-2 text-sm font-bold text-slate-700">{formatMoney(car.price)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {car.specs.map((spec) => <Badge key={spec}>{spec}</Badge>)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4">
                <Input label="Destination city" value={request.destination} placeholder="Berlin" onChange={(event) => actions.updateImportRequest({ destination: event.target.value })} />
                <Input label="Preferred port" placeholder="Hamburg" />
                <Input label="Contact phone" placeholder="+49 170 000 000" />
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <Ship aria-hidden="true" className="mb-3 h-8 w-8 text-brand-600" />
                <h2 className="font-bold text-slate-950">Shipping details</h2>
                <p className="mt-2 leading-7 text-slate-600">Mock logistics include ocean freight, document handling, customs preparation, and local delivery estimate.</p>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl bg-slate-50 p-5">
                <h2 className="text-xl font-bold text-slate-950">Final cost breakdown</h2>
                <CostLine label="Car price" value={formatMoney(costs.car)} />
                <CostLine label="Shipping" value={formatMoney(costs.shipping)} />
                <CostLine label="Customs tax" value={formatMoney(costs.customs)} />
                <CostLine label="Total estimate" value={formatMoney(costs.total)} strong />
              </div>
              <Timeline />
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-24 z-20 -mx-2 mt-8 flex justify-between gap-3 rounded-3xl bg-white/95 p-2 shadow-soft backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0 md:shadow-none">
          <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</Button>
          <Button
            type="button"
            disabled={mutation.isPending || (step === 2 && !request.destination)}
            onClick={() => {
              if (step === 3) mutation.mutate({ ...request, carId: selectedCar.id, costs });
              else setStep((value) => value + 1);
            }}
          >
            {step === 3 ? "Submit import request" : "Next"}
          </Button>
        </div>
      </section>
    </div>
  );
}

function CostLine({ label, value, strong }) {
  return (
    <div className="mt-4 flex justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className={strong ? "text-xl font-extrabold text-slate-950" : "font-bold text-slate-800"}>{value}</span>
    </div>
  );
}

function Timeline() {
  return (
    <div className="rounded-3xl border border-slate-200 p-5">
      <h2 className="mb-4 text-xl font-bold text-slate-950">Tracking timeline</h2>
      <ol className="grid gap-3 sm:grid-cols-4">
        {importTimeline.map((item, index) => (
          <li key={item} className="rounded-2xl bg-slate-50 p-4">
            <span className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-600"}`}>
              {index + 1}
            </span>
            <p className="font-bold text-slate-950">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
