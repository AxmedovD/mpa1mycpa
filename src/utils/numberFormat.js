export const formatNumber = (number) => {
  if (!number) return ''
  // Remove any existing spaces and non-digit characters
  const cleanNumber = number.toString().replace(/[^\d]/g, '')
  // Format with spaces
  return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const unformatNumber = (formattedNumber) => {
  if (!formattedNumber) return 0
  // Remove any non-digit characters (including spaces)
  return parseInt(formattedNumber.toString().replace(/[^\d]/g, ''), 10) || 0
}

export const parseFormattedNumber = (formattedNumber) => {
  if (!formattedNumber) return 0
  // Remove any non-digit characters (including spaces)
  return parseFloat(formattedNumber.toString().replace(/[^\d.]/g, '')) || 0
}
