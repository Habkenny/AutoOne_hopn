import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Landmark } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Loader from "../components/ui/Loader.jsx";
import Modal from "../components/ui/Modal.jsx";
import { loanDurations } from "../features/financing/financeData.js";
import { useMarketplace } from "../features/shared/MarketplaceContext.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { getFinanceOffers, submitFinanceApplication } from "../services/mockApi.js";
import { useAppState } from "../store/AppStateContext.jsx";

export default function Financing() {
  const { state, actions } = useMarketplace();
  const { actions: appActions } = useAppState();
  const { formatMoney } = useCurrency();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [form, setForm] = useState({ name: "", income: "", employment: "" });
  const finance = state.financeApplication;

  const { data: offers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["finance-offers"],
    queryFn: getFinanceOffers,
  });

  const selectedOffer = offers.find((offer) => offer.id === finance.selectedBankId) ?? offers[0];
  const calculator = useMemo(() => {
    const principal = Math.max(0, Number(finance.carPrice) - Number(finance.downPayment));
    const monthlyRate = Number(finance.interestRate) / 100 / 12;
    const months = Number(finance.duration);
    const monthly = monthlyRate
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : principal / months;
    const totalRepayment = monthly * months;
    return {
      principal,
      monthly: Math.round(monthly),
      totalRepayment: Math.round(totalRepayment),
      interestCost: Math.round(totalRepayment - principal),
    };
  }, [finance.carPrice, finance.downPayment, finance.duration, finance.interestRate]);

  const mutation = useMutation({
    mutationFn: submitFinanceApplication,
    onSuccess: () => {
      setApplicationOpen(false);
      appActions.addToast({ title: "Finance application submitted", message: selectedOffer?.name });
    },
  });

  function update(key, value) {
    actions.updateFinanceApplication({ [key]: Number.isNaN(Number(value)) ? value : Number(value) });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne Financing Beta</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Compare car finance offers before you apply.</h1>
        <p className="mt-4 leading-8 text-slate-600">Calculate monthly payments, compare mock banks, and submit a frontend-only application.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <h2 className="mb-5 text-xl font-bold text-slate-950">Loan calculator</h2>
          <div className="space-y-4">
            <Input label="Car price" type="number" value={finance.carPrice} onChange={(event) => update("carPrice", event.target.value)} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Down payment: {formatMoney(finance.downPayment)}</span>
              <input
                type="range"
                min="0"
                max={finance.carPrice}
                value={finance.downPayment}
                onChange={(event) => update("downPayment", event.target.value)}
                className="w-full accent-brand-600"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Loan duration</span>
              <select value={finance.duration} onChange={(event) => update("duration", event.target.value)} className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white px-4">
                {loanDurations.map((duration) => <option key={duration} value={duration}>{duration} months</option>)}
              </select>
            </label>
            <Input label="Interest rate (%)" type="number" step="0.1" value={finance.interestRate} onChange={(event) => update("interestRate", event.target.value)} />
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <Result label="Monthly payment" value={formatMoney(calculator.monthly)} highlight />
            <Result label="Total repayment" value={formatMoney(calculator.totalRepayment)} />
            <Result label="Interest cost" value={formatMoney(calculator.interestCost)} />
          </div>
        </Card>

        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-950">Compare offers</h2>
          {isLoading ? <Loader /> : null}
          {isError ? (
            <Card className="p-8 text-center">
              <p className="font-bold text-slate-950">Unable to load finance offers.</p>
              <Button type="button" onClick={() => refetch()} className="mt-4">Retry</Button>
            </Card>
          ) : null}
          {!isLoading && !isError ? (
            <div className="grid gap-3 pb-24 md:pb-0">
              {offers.map((offer) => (
                <Card key={offer.id} as="article" className={`p-5 transition ${finance.selectedBankId === offer.id ? "ring-2 ring-brand-500" : ""}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Landmark aria-hidden="true" className="h-5 w-5 text-brand-600" />
                        <h3 className="text-lg font-bold text-slate-950">{offer.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{offer.interestRate}% APR · min {offer.minDownPayment}% down</p>
                      <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
                        <Clock3 aria-hidden="true" className="h-4 w-4" />
                        {offer.approvalSpeed}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {offer.features.map((feature) => <Badge key={feature}>{feature}</Badge>)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        actions.updateFinanceApplication({ selectedBankId: offer.id, interestRate: offer.interestRate });
                        setApplicationOpen(true);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <Modal open={applicationOpen} title="Finance application" onClose={() => setApplicationOpen(false)}>
        {mutation.isSuccess ? (
          <div className="text-center">
            <CheckCircle2 aria-hidden="true" className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
            <p className="font-bold text-slate-950">Application submitted</p>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate({ form, finance, selectedOffer, calculator });
            }}
          >
            <Input label="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            <Input label="Monthly income" type="number" value={form.income} onChange={(event) => setForm((current) => ({ ...current, income: event.target.value }))} required />
            <Input label="Employment info" value={form.employment} onChange={(event) => setForm((current) => ({ ...current, employment: event.target.value }))} required />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              Submit application
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

function Result({ label, value, highlight }) {
  return (
    <div className="mb-3 flex justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className={highlight ? "text-2xl font-extrabold text-brand-700" : "font-bold text-slate-950"}>{value}</span>
    </div>
  );
}
