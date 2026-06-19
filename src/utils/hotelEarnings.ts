export const AVG_SPEND_PER_ORDER = 50_000
export const HOTEL_PREMIUM_RATE = 0.13
export const FOUNDING_HOTEL_SHARE = 0.5
export const STANDARD_HOTEL_SHARE = 0.3

export const CALCULATOR_DEFAULTS = {
  rooms: 40,
  roomsMin: 5,
  roomsMax: 500,
  roomsStep: 5,
  occupancyPct: 60,
  occupancyMin: 20,
  occupancyMax: 95,
  occupancyStep: 5,
  conversionPct: 15,
  conversionMin: 5,
  conversionMax: 35,
  conversionStep: 1,
} as const

export interface HotelEarningsResult {
  activeGuests: number
  ordersPerMonth: number
  gmvPerMonth: number
  hotelEarnings: number
  annualEarnings: number
}

export function calcHotelEarnings(
  rooms: number,
  occupancyPct: number,
  conversionPct: number,
  isFoundingPartner: boolean,
): HotelEarningsResult {
  const hotelShare = isFoundingPartner ? FOUNDING_HOTEL_SHARE : STANDARD_HOTEL_SHARE
  const occ = occupancyPct / 100
  const conv = conversionPct / 100
  const activeGuests = Math.round(rooms * occ * 30)
  const ordersPerMonth = Math.round(activeGuests * conv)
  const gmvPerMonth = ordersPerMonth * AVG_SPEND_PER_ORDER
  const hotelEarnings = Math.round(gmvPerMonth * HOTEL_PREMIUM_RATE * hotelShare)

  return {
    activeGuests,
    ordersPerMonth,
    gmvPerMonth,
    hotelEarnings,
    annualEarnings: hotelEarnings * 12,
  }
}

export function formatTzs(amount: number): string {
  return `TZS ${amount.toLocaleString('en-US')}`
}
