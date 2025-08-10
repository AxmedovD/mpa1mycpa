export function formatCurrency(value, currency = 'UZS') {
  return `${Number(value).toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })} ${currency}`
}

export function formatQuantity(value) {
  return Number(value).toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}