export interface DiscoveryItem {
  id: string
  section: 'events' | 'restaurants' | 'tours'
  subcategory: string
  slug: string
  name: string
  description: string
  image_url: string
  venue: string
  location: string
  distance: string
  phone: string
  website: string
  price_hint: string
  event_starts_at?: string
  event_ends_at?: string
  ticket_url: string
  ticket_mode: 'none' | 'referral' | 'platform'
  price_tzs?: number
  ticket_capacity?: number
  tickets_sold?: number
  tickets_left?: number
  organizer_name?: string
  is_featured: boolean
}

export interface DiscoveryPortal {
  events: DiscoveryItem[]
  restaurants: DiscoveryItem[]
  tours: DiscoveryItem[]
}

export interface AdminDiscoveryItem extends DiscoveryItem {
  hotel_id?: string | null
  organizer_email?: string
  status: 'pending' | 'active' | 'removed'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SubmitDiscoveryEventPayload {
  name: string
  description: string
  subcategory: string
  venue: string
  location?: string
  event_starts_at: string
  event_ends_at?: string
  organizer_name: string
  organizer_email: string
  organizer_phone?: string
  website?: string
  ticket_url?: string
  ticket_mode?: string
  hotel_slug?: string
}
