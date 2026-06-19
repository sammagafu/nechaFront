export function orderTypeLabel(type: string) {
  if (type === 'product') return 'Shop delivery'
  if (type === 'food') return 'Room service'
  return type
}

export function formatAdminDateTime(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function shortRef(id: string) {
  return id.slice(0, 8)
}

export const orderStatuses = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
  'failed',
] as const

export function orderStatusBadgeClass(status: string) {
  if (status === 'delivered' || status === 'confirmed') return 'admin-badge--active'
  if (status === 'pending' || status === 'preparing' || status === 'ready') return 'admin-badge--pending'
  return 'admin-badge--inactive'
}
