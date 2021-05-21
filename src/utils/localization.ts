export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('us-EN', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
  }).format(amount)
