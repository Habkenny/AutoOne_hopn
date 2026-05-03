import { useMutation } from "@tanstack/react-query";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { loginUser } from "../services/mockApi.js";
import { useAppState } from "../store/AppStateContext.jsx";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { actions } = useAppState();
  const [email, setEmail] = useState("alex@autoone.app");
  const [password, setPassword] = useState("password");

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      actions.login(user);
      actions.addToast({ title: "Logged in", message: "Welcome back to AutoOne." });
      navigate(location.state?.from ?? "/dashboard", { replace: true });
    },
  });

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-28 pt-10 md:grid-cols-2 md:items-center md:pb-14">
      <section>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">AutoOne</p>
        <h1 className="text-4xl font-extrabold text-slate-950">{t("auth.welcome")}</h1>
        <p className="mt-4 leading-7 text-slate-600">Access your bookings, saved services, and partner tools with a simulated frontend session.</p>
      </section>

      <form
        className="surface space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ email, password });
        }}
      >
        <Input label={t("auth.email")} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label={t("auth.password")} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {t("auth.submitLogin")}
        </Button>
        <Button type="button" variant="secondary" className="w-full gap-2" onClick={() => mutation.mutate({ email, password })}>
          <CircleUserRound aria-hidden="true" className="h-5 w-5" />
          {t("auth.social")}
        </Button>
        <p className="text-center text-sm text-slate-600">
          <Link to="/signup" className="font-bold text-brand-700">{t("auth.signup")}</Link>
        </p>
      </form>
    </div>
  );
}
