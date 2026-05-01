import { Coins } from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency.js";
import { supportedCurrencies } from "../../utils/currency.js";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className="focus-within:ring-brand-500 inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 focus-within:ring-2">
      <Coins aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value)}
        className="bg-transparent outline-none"
        aria-label="Currency"
      >
        {supportedCurrencies.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
