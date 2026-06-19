/** Static images served from /assets/* (copied to dist/assets at build). */
export const siteImages = {
  banner: '/assets/banner-2.jpg',
  mosaic: ['/assets/assets-3.jpg', '/assets/assets-4.jpg', '/assets/assets-5.jpg'] as const,
  editorial: '/assets/2.jpg',
  categories: {
    skin_care: '/assets/assets-3.jpg',
    wellness: '/assets/3.jpg',
    personal_care: '/assets/assets-4.jpg',
    hair_care: '/assets/1.jpg',
    fragrance: '/assets/assets-5.jpg',
  },
  why: {
    delivery: '/assets/2.jpg',
    brands: '/assets/assets-3.jpg',
    rewards: '/assets/banner-2.jpg',
    payments: '/assets/3.jpg',
  },
  steps: ['/assets/banner-2.jpg', '/assets/1.jpg', '/assets/2.jpg'] as const,
  products: {
    lemongrass: '/assets/assets-3.jpg',
    turmeric: '/assets/assets-4.jpg',
    baobab: '/assets/assets-5.jpg',
    clove: '/assets/1.jpg',
  },
  partnerLanding: {
    heroA: '/assets/banner-2.jpg',
    heroB: '/assets/assets-5.jpg',
    platform: '/assets/assets-3.jpg',
    showcase: '/assets/assets-4.jpg',
    why: '/assets/2.jpg',
    steps: ['/assets/banner-2.jpg', '/assets/1.jpg', '/assets/2.jpg', '/assets/assets-3.jpg'] as const,
    brands: '/assets/3.jpg',
    founding: '/assets/assets-5.jpg',
    calculator: '/assets/assets-4.jpg',
    discovery: '/assets/1.jpg',
    mosaic: ['/assets/assets-3.jpg', '/assets/assets-4.jpg', '/assets/assets-5.jpg'] as const,
  },
} as const
