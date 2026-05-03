import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, DollarSign, ListChecks, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import { SkeletonGrid } from "../components/Skeleton.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { addPartnerService, getPartnerDashboard, updateBookingStatus } from "../services/mockApi.js";
import { useAppState } from "../store/AppStateContext.jsx";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Partner() {
  const { t } = useTranslation();
  const { actions } = useAppState();
  const queryClient = useQueryClient();
  const { formatMoney } = useCurrency();
  const [bookingStatuses, setBookingStatuses] = useState({});
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["partner-dashboard"],
    queryFn: getPartnerDashboard,
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partner-dashboard"] }),
  });
  const addServiceMutation = useMutation({
    mutationFn: addPartnerService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partner-dashboard"] }),
  });

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-8"><SkeletonGrid /></div>;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <section className="surface p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-950">Unable to load partner dashboard</h1>
          <p className="mt-3 text-slate-600">This mock API occasionally simulates a failed request.</p>
          <Button type="button" onClick={() => refetch()} className="mt-6">Retry</Button>
        </section>
      </div>
    );
  }

  const serviceRows = services.length ? services : data.services;
  const maxTrend = Math.max(...data.trends.map((item) => item.value));

  function updateStatus(id, status) {
    setBookingStatuses((current) => ({ ...current, [id]: status }));
    statusMutation.mutate({ id, status });
    actions.addToast({ title: `Booking ${status}`, message: "Partner action saved." });
  }

  function addService(event) {
    event.preventDefault();
    if (!newService.name || !newService.price) return;
    addServiceMutation.mutate({ ...newService, price: Number(newService.price) });
    setServices((current) => [{ id: `svc-${Date.now()}`, ...newService, active: true }, ...serviceRows]);
    setNewService({ name: "", price: "", duration: "" });
    actions.addToast({ title: "Service added", message: "Service management was saved." });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne Partner</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">{t("partner.title")}</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label={t("partner.overview")}>
        <Stat icon={ListChecks} label="Total bookings" value={data.stats.totalBookings} />
        <Stat icon={DollarSign} label="Revenue" value={formatMoney(data.stats.revenue)} />
        <Stat icon={TrendingUp} label="Active requests" value={data.stats.activeRequests} />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-950">{t("partner.management")}</h2>
          <div className="space-y-3">
            {data.bookings.map((booking) => {
              const status = bookingStatuses[booking.id] ?? booking.status;
              return (
                <article key={booking.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{booking.customer}</h3>
                        <Badge tone={status}>{status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{booking.service} · {booking.date} · {booking.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={() => updateStatus(booking.id, "confirmed")}>
                        {t("partner.accept")}
                      </Button>
                      <Button type="button" variant="danger" onClick={() => updateStatus(booking.id, "cancelled")}>
                        {t("partner.reject")}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <section className="surface p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-950">Booking trends</h2>
            <div className="flex h-48 items-end gap-3">
              {data.trends.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-brand-600" style={{ height: `${(item.value / maxTrend) * 100}%` }} />
                  <span className="text-xs font-bold text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-950">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-brand-600" />
              {t("partner.calendar")}
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={day} className={`rounded-2xl p-3 text-center text-sm font-bold ${index < 5 ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                  {day}
                  <span className="mt-1 block text-xs font-semibold">{index < 5 ? "Open" : "Off"}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <form className="surface space-y-4 p-5" onSubmit={addService}>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <Plus aria-hidden="true" className="h-5 w-5 text-brand-600" />
            {t("partner.addService")}
          </h2>
          <Input label="Service name" value={newService.name} onChange={(event) => setNewService((current) => ({ ...current, name: event.target.value }))} />
          <Input label="Price" type="number" value={newService.price} onChange={(event) => setNewService((current) => ({ ...current, price: event.target.value }))} />
          <Input label="Duration" value={newService.duration} onChange={(event) => setNewService((current) => ({ ...current, duration: event.target.value }))} />
          <Button type="submit" className="w-full">{t("partner.addService")}</Button>
        </form>

        <div className="surface p-5">
          <h2 className="mb-4 text-xl font-bold text-slate-950">{t("partner.services")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceRows.map((service) => (
              <article key={service.id} className="rounded-3xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-950">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{formatMoney(service.price)} · {service.duration}</p>
                <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => actions.addToast({ title: "Edit mode", message: "Edit service UI placeholder opened." })}>
                  Edit
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <article className="surface p-5">
      <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
        <Icon aria-hidden="true" className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-950">{value}</p>
    </article>
  );
}
