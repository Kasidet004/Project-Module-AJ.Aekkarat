export function formatCurrency(value) {
  const n = Number(value) || 0
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(n)
}

export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function truncate(text, max = 60) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}
