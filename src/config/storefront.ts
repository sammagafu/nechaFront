export const storefrontConfig = {
  freeDeliveryThresholdTZS: 180_000,
  deliveryFeeTZS: 5_000,
  tzsToUsdRate: 2625,
  deliveryMinutes: '60–90 min',
  whatsapp: '+255784455439',
  zones: 'Zone A: Mbezi Beach · Zone B: Kunduchi · Zone C: Mikocheni · Zone D: City Centre · Zone E: Oysterbay / Masaki · Zone F: Airport',
}

export const productCategories = [
  { id: 'all', label: 'All products' },
  { id: 'skin_care', label: 'Skin care' },
  { id: 'hair_care', label: 'Hair care' },
  { id: 'personal_care', label: 'Personal care' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'fragrance', label: 'Fragrance' },
  { id: 'accessories', label: 'Accessories' },
]

export const hotelServices = {
  spa: {
    icon: 'spa',
    heading: 'Spa & wellness',
    body: (name: string) => `Book a massage, facial or treatment at the ${name} Spa`,
    action: 'Book a session',
    route: 'spa',
    colors: { bg: '#f5f5f5', fg: '#1a1a1a' },
  },
  restaurant: {
    icon: 'restaurant',
    heading: 'Restaurant',
    body: (name: string) => `Reserve a table at the ${name} restaurant — lunch & dinner`,
    action: 'Reserve a table',
    route: 'restaurant',
    colors: { bg: '#f0f0f0', fg: '#000000' },
  },
  bar: {
    icon: 'bar',
    heading: 'Bar & lounge',
    body: (name: string) => `View the cocktail menu or reserve a spot at the ${name} bar`,
    action: 'View menu',
    route: 'bar',
    colors: { bg: '#e8e8e8', fg: '#000000' },
  },
  nearby: {
    icon: 'nearby',
    heading: 'Nearby experiences',
    body: (loc: string) => `Restaurants, beach clubs and wellness centres around ${loc}`,
    action: 'Explore nearby',
    route: 'nearby',
    colors: { bg: '#f1efe8', fg: '#444441' },
  },
  gym: {
    icon: 'gym',
    heading: 'Gym & fitness',
    body: (name: string) => `Book a fitness session or access the ${name} gym`,
    action: 'Book a session',
    route: 'gym',
    colors: { bg: '#f5f5f5', fg: '#1a1a1a' },
  },
} as const
