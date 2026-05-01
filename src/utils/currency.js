export const supportedCurrencies = [
  { code: "USD", label: "USD", locale: "en-US", rateFromUsd: 1 },
  { code: "EUR", label: "EUR", locale: "de-DE", rateFromUsd: 0.92 },
  { code: "AED", label: "AED", locale: "ar-AE", rateFromUsd: 3.67 },
  { code: "SAR", label: "SAR", locale: "ar-SA", rateFromUsd: 3.75 },
];

export function getCurrencyMeta(code) {
  return supportedCurrencies.find((currency) => currency.code === code) ?? supportedCurrencies[0];
}

export function convertFromUsd(amount, currencyCode) {
  const numericAmount = Number(amount || 0);
  return numericAmount * getCurrencyMeta(currencyCode).rateFromUsd;
}

export function formatCurrency(amount, currencyCode = "USD", options = {}) {
  const currency = getCurrencyMeta(currencyCode);
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(convertFromUsd(amount, currency.code));
}
