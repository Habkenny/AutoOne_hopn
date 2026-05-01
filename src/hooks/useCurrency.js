import { useMemo } from "react";
import { useAppState } from "../store/AppStateContext.jsx";
import { formatCurrency } from "../utils/currency.js";

export function useCurrency() {
  const { state, actions } = useAppState();

  return useMemo(
    () => ({
      currency: state.currency,
      setCurrency: actions.setCurrency,
      formatMoney: (amount, options) => formatCurrency(amount, state.currency, options),
    }),
    [actions.setCurrency, state.currency]
  );
}
