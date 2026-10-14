/* Merchant operating currency. Default is Naira (NGN).
   Amounts render through formatMoney so every figure carries the symbol. */

export const DEFAULT_CURRENCY = "NGN";

export const CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
  { code: "GHS", symbol: "₵", label: "Ghanaian Cedi" },
  { code: "KES", symbol: "KSh", label: "Kenyan Shilling" },
  { code: "ZAR", symbol: "R", label: "South African Rand" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "XOF", symbol: "CFA", label: "West African CFA Franc" },
  { code: "XAF", symbol: "FCFA", label: "Central African CFA Franc" },
  { code: "EGP", symbol: "E£", label: "Egyptian Pound" },
  { code: "RWF", symbol: "RF", label: "Rwandan Franc" },
];

export function currencySymbol(code) {
  const found = CURRENCIES.find(c => c.code === (code || "").toUpperCase());
  return found ? found.symbol : (CURRENCIES.find(c => c.code === DEFAULT_CURRENCY) || {}).symbol || "₦";
}

export function formatMoney(amount, code) {
  const n = Number(amount) || 0;
  return `${currencySymbol(code)}${n.toLocaleString()}`;
}

export function getMerchantCurrency(merchant) {
  if (merchant?.currency) return merchant.currency;
  try {
    const raw = localStorage.getItem("dd_merchant");
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored?.currency) return stored.currency;
    }
  } catch { /* ignore */ }
  return DEFAULT_CURRENCY;
}
