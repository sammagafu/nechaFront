export const messageCategories = [
  { id: 'orders', label: 'Orders' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'products', label: 'Products' },
  { id: 'hotel-partners', label: 'Hotel partners' },
  { id: 'account', label: 'Account' },
  { id: 'other', label: 'Other' },
] as const

export type MessageCategoryId = (typeof messageCategories)[number]['id']

export function categoryLabel(id: string) {
  return messageCategories.find((c) => c.id === id)?.label ?? id
}
