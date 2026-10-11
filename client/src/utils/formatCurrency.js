/**
 * Format numeric amounts in Indian Rupees (INR) with Indian comma grouping.
 * Example: 29999 -> "₹29,999"
 */
export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
}
