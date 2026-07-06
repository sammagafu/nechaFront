/** Product pack shots only — matches catalog seed image_url values. */
export const productImageBySlug: Record<string, string> = {
  'lemongrass-body-butter': '/assets/assets-3.jpg',
  'baobab-face-oil': '/assets/assets-5.jpg',
  'turmeric-soap': '/assets/assets-4.jpg',
  'clove-soap': '/assets/1.jpg',
}

export interface HeroSlideMeta {
  id: string
  brand: string
  label: string
  wordLeft: string
  wordRight: string
  description: string
  cta: string
  ctaTo: string
  productSlug: string
  tint: string
}

/** Hero carousel — featured partner catalogue products. */
export const heroSlideMeta: HeroSlideMeta[] = [
  {
    id: 'body',
    brand: 'Necha Africa',
    label: 'Body butter',
    wordLeft: 'Skin',
    wordRight: 'Deep',
    description:
      'Whipped shea and lemongrass body butter — deeply nourishing with a fresh citrus scent.',
    cta: 'Explore brands',
    ctaTo: '/brands',
    productSlug: 'lemongrass-body-butter',
    tint: '#c4e86a',
  },
  {
    id: 'oil',
    brand: 'Necha Africa',
    label: 'Face oil',
    wordLeft: 'Glow',
    wordRight: 'Naturally',
    description:
      'Cold-pressed baobab face oil — vitamins A, D and E for skin and hair ritual.',
    cta: 'Explore brands',
    ctaTo: '/brands',
    productSlug: 'baobab-face-oil',
    tint: '#8ab4f8',
  },
  {
    id: 'soap',
    brand: 'Necha Africa',
    label: 'Turmeric soap',
    wordLeft: 'Bright',
    wordRight: 'Clean',
    description:
      'Brightening turmeric bar — reduces dark spots and evens skin tone naturally.',
    cta: 'Explore brands',
    ctaTo: '/brands',
    productSlug: 'turmeric-soap',
    tint: '#f0c674',
  },
  {
    id: 'clove',
    brand: 'Necha Africa',
    label: 'Clove soap',
    wordLeft: 'Pure',
    wordRight: 'Ritual',
    description:
      'Natural clove oil soap — antibacterial, antifungal and deeply cleansing.',
    cta: 'Explore brands',
    ctaTo: '/brands',
    productSlug: 'clove-soap',
    tint: '#e8a87c',
  },
]
