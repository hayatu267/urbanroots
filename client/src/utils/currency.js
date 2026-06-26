// Formats a number as Pakistani Rupees, e.g. 5999 -> "Rs 5,999"
export function formatPKR(amount) {
  const num = Number(amount) || 0;
  return `Rs ${num.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}
