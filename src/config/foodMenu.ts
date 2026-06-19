export interface FoodMenuItem {
  id: string
  category: string
  name: string
  description: string
  price: number
  tag?: string
}

export interface FoodMenuCategory {
  id: string
  label: string
}

export const foodMenuCategories: FoodMenuCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'mains', label: 'Mains' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'desserts', label: 'Desserts' },
]

export const foodMenuItems: FoodMenuItem[] = [
  {
    id: 'bf-1',
    category: 'breakfast',
    name: 'Tropical fruit bowl',
    description: 'Seasonal mango, papaya & passion fruit with mint.',
    price: 18000,
    tag: 'Light',
  },
  {
    id: 'bf-2',
    category: 'breakfast',
    name: 'Swahili coconut pancakes',
    description: 'Mkate wa sinia with honey butter & cardamom.',
    price: 22000,
  },
  {
    id: 'bf-3',
    category: 'breakfast',
    name: 'Eggs your way',
    description: 'Free-range eggs, grilled tomato, chapati or toast.',
    price: 20000,
  },
  {
    id: 'main-1',
    category: 'mains',
    name: 'Grilled tilapia & ugali',
    description: 'Lake fish, kachumbari, lemon herb butter.',
    price: 38000,
    tag: 'Chef pick',
  },
  {
    id: 'main-2',
    category: 'mains',
    name: 'Chicken pilau',
    description: 'Fragrant rice, sukuma, house chilli relish.',
    price: 32000,
  },
  {
    id: 'main-3',
    category: 'mains',
    name: 'Vegetable curry & rice',
    description: 'Coconut lentil curry, basmati, pickled onion.',
    price: 28000,
    tag: 'Vegan',
  },
  {
    id: 'main-4',
    category: 'mains',
    name: 'Beef mishkaki platter',
    description: 'Charred skewers, chips, tamarind dip.',
    price: 42000,
  },
  {
    id: 'dr-1',
    category: 'drinks',
    name: 'Fresh passion juice',
    description: 'Pressed to order, lightly sweetened.',
    price: 12000,
  },
  {
    id: 'dr-2',
    category: 'drinks',
    name: 'Dawa mocktail',
    description: 'Lime, honey, ginger — the classic, alcohol-free.',
    price: 15000,
    tag: 'Popular',
  },
  {
    id: 'dr-3',
    category: 'drinks',
    name: 'Kilimanjaro coffee',
    description: 'Single-origin pour-over or cafetière.',
    price: 10000,
  },
  {
    id: 'ds-1',
    category: 'desserts',
    name: 'Mandazi & chocolate dip',
    description: 'Warm cardamom doughnuts, dark chocolate.',
    price: 16000,
  },
  {
    id: 'ds-2',
    category: 'desserts',
    name: 'Mango sorbet',
    description: 'Coconut crisp, lime zest.',
    price: 14000,
  },
]
