export const discoverySections = [
  { id: 'events', label: 'Events', tagline: 'What is happening in Dar this week' },
  { id: 'restaurants', label: 'Restaurants', tagline: 'Where to eat around you' },
  { id: 'tours', label: 'Tours & experiences', tagline: 'Things to do during your stay' },
] as const

export type DiscoverySectionId = (typeof discoverySections)[number]['id']

export const eventSubcategories = [
  { id: 'music', label: 'Music' },
  { id: 'beach', label: 'Beach' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'art', label: 'Art' },
  { id: 'networking', label: 'Networking' },
  { id: 'sport', label: 'Sport' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'nightlife', label: 'Nightlife' },
]

export const restaurantSubcategories = [
  { id: 'popular', label: 'Popular' },
  { id: 'rooftop', label: 'Rooftop' },
  { id: 'fine_dining', label: 'Fine dining' },
  { id: 'local', label: 'Local Tanzanian' },
  { id: 'beachfront', label: 'Beachfront' },
  { id: 'trending', label: 'Trending' },
]

export const tourSubcategories = [
  { id: 'island', label: 'Island trips' },
  { id: 'yacht', label: 'Yacht & water' },
  { id: 'city', label: 'City tours' },
  { id: 'museum', label: 'Museums' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'historical', label: 'Historical' },
  { id: 'beach', label: 'Beach' },
  { id: 'local', label: 'Local activities' },
]

export function subcategoryLabel(section: DiscoverySectionId, id: string) {
  const map = {
    events: eventSubcategories,
    restaurants: restaurantSubcategories,
    tours: tourSubcategories,
  }[section]
  return map.find((c) => c.id === id)?.label ?? id.replace(/_/g, ' ')
}
