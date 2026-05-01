import { CalendarCheck, Heart, Settings, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";
import { useCurrency } from "../hooks/useCurrency.js";
import { useAppState } from "../store/AppStateContext.jsx";
import { writeStorage } from "../utils/storage.js";

const tabs = [
  { id: "bookings", icon: CalendarCheck, labelKey: "dashboard.bookings" },
  { id: "saved", icon: Heart, labelKey: "dashboard.saved" },
  { id: "profile", icon: Settings, labelKey: "dashboard.profile" },
];

const bookingFilters = ["upcoming", "completed", "cancelled"];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { state, actions } = useAppState();
  const { currency, setCurrency, formatMoney } = useCurrency();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookingFilter, setBookingFilter] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profile, setProfile] = useState({ language: "en", ...state.auth.user });

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "upcoming") {
      return state.bookings.filter((booking) => ["pending", "confirmed"].includes(booking.status));
    }
    return state.bookings.filter((booking) => booking.status === bookingFilter);
  }, [bookingFilter, state.bookings]);

  function saveProfile(event) {
    event.preventDefault();
    actions.updateProfile(profile);
    i18n.changeLanguage(profile.language);
    writeStorage("autoone.language", profile.language);
    actions.addToast({ title: "Profile updated", message: "Your preferences were saved." });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-14">
      <section className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">{t("dashboard.title")}</h1>
        <p className="mt-3 text-slate-600">{state.auth.user?.name}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="surface h-max p-3">
          {tabs.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`focus-ring mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start font-bold transition ${
                activeTab === id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              {t(labelKey)}
            </button>
          ))}
        </aside>

        <section>
          {activeTab === "bookings" ? (
            <div className="space-y-4">
              <div className="surface flex flex-wrap gap-2 p-3">
                {bookingFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setBookingFilter(filter)}
                    className={`focus-ring rounded-2xl px-4 py-2 text-sm font-bold capitalize ${
                      bookingFilter === filter ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {filteredBookings.length ? (
                <div className="grid gap-3">
                  {filteredBookings.map((booking) => (
                    <article key={booking.id} className="surface p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-950">{booking.providerName}</h2>
                            <Badge tone={booking.status}>{booking.status}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">
                            {booking.date} · {booking.time} · {booking.car}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="secondary" onClick={() => setSelectedBooking(booking)}>
                            {t("dashboard.details")}
                          </Button>
                          {booking.status !== "cancelled" && booking.status !== "completed" ? (
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => {
                                actions.updateBookingStatus(booking.id, "cancelled");
                                actions.addToast({ title: "Booking cancelled", message: booking.providerName });
                              }}
                            >
                              {t("dashboard.cancel")}
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title={t("dashboard.empty")} />
              )}
            </div>
          ) : null}

          {activeTab === "saved" ? (
            state.favorites.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.favorites.map((provider) => (
                  <article key={provider.id} className="surface overflow-hidden">
                    <img src={provider.hero} alt="" className="h-36 w-full object-cover" />
                    <div className="p-5">
                      <h2 className="font-bold text-slate-950">{provider.name}</h2>
                      <p className="mt-2 text-sm text-slate-600">{provider.location} · {formatMoney(provider.priceFrom)}</p>
                      <Button as="link" to={`/services/${provider.type}/${provider.id}`} className="mt-4 w-full">
                        {t("common.bookNow")}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="No saved services yet" icon={Heart} />
            )
          ) : null}

          {activeTab === "profile" ? (
            <form className="surface grid gap-4 p-5 sm:grid-cols-2" onSubmit={saveProfile}>
              <Input label={t("booking.name")} value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
              <Input label={t("auth.email")} type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
              <Input label={t("booking.phone")} value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Language preference</span>
                <select
                  value={profile.language}
                  onChange={(event) => setProfile((current) => ({ ...current, language: event.target.value }))}
                  className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white px-4"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="de">German</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Currency preference</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="focus-ring h-12 w-full rounded-2xl border border-slate-200 bg-white px-4"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="AED">AED</option>
                  <option value="SAR">SAR</option>
                </select>
              </label>
              <Button type="submit" className="sm:col-span-2">{t("common.confirm")}</Button>
            </form>
          ) : null}
        </section>
      </div>

      <Modal open={Boolean(selectedBooking)} title={t("dashboard.details")} onClose={() => setSelectedBooking(null)}>
        {selectedBooking ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Provider" value={selectedBooking.providerName} />
            <Detail label="Status" value={selectedBooking.status} />
            <Detail label={t("booking.date")} value={selectedBooking.date} />
            <Detail label={t("booking.time")} value={selectedBooking.time} />
            <Detail label={t("booking.car")} value={selectedBooking.car} />
            <Detail label={t("common.price")} value={selectedBooking.price ? formatMoney(selectedBooking.price) : "-"} />
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}

function EmptyState({ title, icon: Icon = Wrench }) {
  return (
    <div className="surface p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </div>
      <p className="font-bold text-slate-700">{title}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-slate-950">{value}</dd>
    </div>
  );
}
