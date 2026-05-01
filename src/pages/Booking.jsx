import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import StepIndicator from "../components/StepIndicator.jsx";
import { useServiceFeature } from "../hooks/useServiceFeature.js";
import { useCurrency } from "../hooks/useCurrency.js";
import { createBooking, serviceTypes } from "../services/mockApi.js";
import { useAppState } from "../store/AppStateContext.jsx";

export default function Booking() {
  const { serviceType = "workshops", serviceId } = useParams();
  const { t } = useTranslation();
  const { formatMoney } = useCurrency();
  const { actions } = useAppState();
  const service = serviceTypes[serviceType];
  const feature = useServiceFeature(serviceType);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState({
    providerId: serviceId ?? "",
    date: "",
    time: "",
    name: "",
    phone: "",
    car: "",
    notes: "",
  });

  const { data: providers = [] } = useQuery({
    queryKey: ["booking-providers", serviceType],
    queryFn: () => feature.listProviders(),
    enabled: Boolean(service?.enabled && feature),
  });

  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.id === booking.providerId),
    [booking.providerId, providers]
  );

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (result) => {
      actions.addBooking({
        ...result,
        providerName: selectedProvider?.name ?? "AutoOne provider",
        price: selectedProvider?.priceFrom,
        status: "pending",
      });
      actions.addToast({
        title: t("booking.successTitle"),
        message: selectedProvider?.name,
      });
      setStep(4);
    },
  });

  if (!service?.enabled) {
    return <Navigate to="/services" replace />;
  }

  const steps = [
    t("booking.serviceStep"),
    t("booking.scheduleStep"),
    t("booking.detailsStep"),
    t("booking.confirmStep"),
  ];

  function updateBooking(key, value) {
    setError("");
    setBooking((current) => ({ ...current, [key]: value }));
  }

  function canContinue() {
    if (step === 0) return Boolean(booking.providerId);
    if (step === 1) return Boolean(booking.date && booking.time);
    if (step === 2) return Boolean(booking.name && booking.phone && booking.car);
    return true;
  }

  function handleNext() {
    if (!canContinue()) {
      setError(t("booking.required"));
      return;
    }

    if (step === 3) {
      mutation.mutate({ ...booking, serviceType });
      return;
    }

    setStep((current) => current + 1);
  }

  function reset() {
    setStep(0);
    setBooking({
      providerId: "",
      date: "",
      time: "",
      name: "",
      phone: "",
      car: "",
      notes: "",
    });
    mutation.reset();
  }

  if (step === 4) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-12 md:pb-14">
        <section className="surface p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950">{t("booking.successTitle")}</h1>
          <p className="mt-3 leading-7 text-slate-600">{t("booking.successBody")}</p>
          <Button type="button" onClick={reset} className="mt-6">
            {t("common.reset")}
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{t("booking.title")}</h1>
        <p className="mt-2 text-slate-600">{t(service.labelKey)}</p>
      </section>

      <div className="surface p-5 sm:p-6">
        <StepIndicator steps={steps} currentStep={step} />

        <form
          className="mt-8"
          onSubmit={(event) => {
            event.preventDefault();
            handleNext();
          }}
        >
          {step === 0 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-950">{t("booking.selectService")}</h2>
              <div className="grid gap-3">
                {providers.map((provider) => (
                  <label
                    key={provider.id}
                    className={`cursor-pointer rounded-3xl border p-4 transition ${
                      booking.providerId === provider.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={provider.id}
                      checked={booking.providerId === provider.id}
                      onChange={(event) => updateBooking("providerId", event.target.value)}
                      className="sr-only"
                    />
                    <span className="block font-bold text-slate-950">{provider.name}</span>
                    <span className="text-sm text-slate-600">
                      {provider.location} · {t("common.from")} {formatMoney(provider.priceFrom)}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-950">{t("booking.chooseSchedule")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">{t("booking.date")}</span>
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(event) => updateBooking("date", event.target.value)}
                    className="focus-ring h-12 w-full rounded-2xl border border-slate-200 px-4"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">{t("booking.time")}</span>
                  <select
                    value={booking.time}
                    onChange={(event) => updateBooking("time", event.target.value)}
                    className="focus-ring h-12 w-full rounded-2xl border border-slate-200 px-4"
                  >
                    <option value="">{t("booking.selectTime")}</option>
                    {(selectedProvider?.timeSlots ?? []).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-950">{t("booking.yourDetails")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={t("booking.name")} value={booking.name} onChange={(value) => updateBooking("name", value)} />
                <TextField label={t("booking.phone")} value={booking.phone} onChange={(value) => updateBooking("phone", value)} />
                <TextField label={t("booking.car")} value={booking.car} onChange={(value) => updateBooking("car", value)} />
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">{t("booking.notes")}</span>
                  <textarea
                    value={booking.notes}
                    onChange={(event) => updateBooking("notes", event.target.value)}
                    className="focus-ring min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  />
                </label>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-950">{t("booking.summary")}</h2>
              <dl className="grid gap-3 rounded-3xl bg-slate-50 p-5 sm:grid-cols-2">
                <SummaryItem label={t("nav.services")} value={selectedProvider?.name} />
                <SummaryItem label={t("common.location")} value={selectedProvider?.location} />
                <SummaryItem label={t("booking.date")} value={booking.date} />
                <SummaryItem label={t("booking.time")} value={booking.time} />
                <SummaryItem label={t("booking.name")} value={booking.name} />
                <SummaryItem label={t("booking.car")} value={booking.car} />
              </dl>
            </section>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("common.back")}
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="disabled:cursor-wait disabled:opacity-70">
              {step === 3 ? t("common.confirm") : t("common.next")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-12 w-full rounded-2xl border border-slate-200 px-4"
      />
    </label>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-slate-950">{value || "-"}</dd>
    </div>
  );
}
