export interface CommerceProduct {
  id: string
  slug?: string
  brandName?: string
  name: string
  description: string
  price: number
  currency: string
  hotelCode?: string
  hotelSlug?: string
  imageUrl?: string
  stock?: number
  badge?: string
}

export interface CartItem extends CommerceProduct {
  quantity: number
}
