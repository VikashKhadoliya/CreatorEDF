import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind and conditional class names cleanly
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with 2 decimal places
 */
export function formatCurrency(amount, currency = "USD") {
  if (amount === null || amount === undefined || isNaN(amount)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to standard Indian trade document format: dd-mmm-yyyy
 */
export function formatTradeDate(dateInput) {
  if (!dateInput) return "-";
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split("-");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${day}-${months[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}

