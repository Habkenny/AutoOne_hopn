import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useAppState } from "../store/AppStateContext.jsx";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { actions } = useAppState();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-10 md:pb-14">
      <form
        className="surface space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          actions.login(form);
          actions.addToast({ title: "Account created", message: "Your simulated account is ready." });
          navigate("/dashboard");
        }}
      >
        <h1 className="text-3xl font-extrabold text-slate-950">{t("auth.create")}</h1>
        <Input label={t("booking.name")} value={form.name} onChange={(event) => update("name", event.target.value)} required />
        <Input label={t("auth.email")} type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
        <Input label={t("booking.phone")} value={form.phone} onChange={(event) => update("phone", event.target.value)} required />
        <Input label={t("auth.password")} type="password" value={form.password} onChange={(event) => update("password", event.target.value)} required />
        <Button type="submit" className="w-full">{t("auth.submitSignup")}</Button>
        <p className="text-center text-sm text-slate-600">
          <Link to="/login" className="font-bold text-brand-700">{t("auth.login")}</Link>
        </p>
      </form>
    </div>
  );
}
