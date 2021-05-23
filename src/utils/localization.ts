export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('us-EN', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
  }).format(amount)

export const dateFromTimestamp = (timestamp?: number | null) => {
  if (typeof timestamp !== 'number') {
    return
  }
  const milliseconds = timestamp * 1000
  const dateObject = new Date(milliseconds)

  return new Intl.DateTimeFormat('en-US').format(dateObject)
}
