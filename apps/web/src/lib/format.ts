export function formatINR(value: number | string) {
  const amount = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
