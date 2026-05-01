import { UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button.jsx";

export default function Profile() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-10 md:pb-14">
      <section className="surface p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <UserRound aria-hidden="true" className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-950">{t("profile.title")}</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">{t("profile.body")}</p>
        <Button as="link" to="/services/workshops" className="mt-6">
          {t("home.workshopAction")}
        </Button>
      </section>
    </div>
  );
}
