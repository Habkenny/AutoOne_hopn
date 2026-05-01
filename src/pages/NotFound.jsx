import { useTranslation } from "react-i18next";
import Button from "../components/Button.jsx";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-14 text-center md:pb-14">
      <section className="surface p-8">
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-950">{t("notFound.title")}</h1>
        <p className="mt-3 text-slate-600">{t("notFound.body")}</p>
        <Button as="link" to="/" className="mt-6">{t("nav.home")}</Button>
      </section>
    </div>
  );
}
