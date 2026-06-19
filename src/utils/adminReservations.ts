export function reservationTypeLabel(type: string) {
  if (type === 'hotel') return 'Room stay'
  if (type === 'table') return 'Table dining'
  return type
}

export function reservationSummary(reservation: {
  type: string
  check_in?: string
  check_out?: string
  reservation_date?: string
  party_size?: number
}) {
  if (reservation.type === 'hotel') {
    const checkIn = reservation.check_in?.slice(0, 10) ?? '—'
    const checkOut = reservation.check_out?.slice(0, 10) ?? '—'
    return `${checkIn} → ${checkOut}`
  }
  const when = reservation.reservation_date?.slice(0, 16) ?? '—'
  return `${when} · ${reservation.party_size ?? 0} guests`
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

export const reservationStatuses = ['pending', 'confirmed', 'cancelled', 'failed'] as const
