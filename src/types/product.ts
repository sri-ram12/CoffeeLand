export type CategoryId = 
  | 'all'
  | 'hot-coffee'
  | 'cold-coffee'
  | 'hot-chocolate-tea'
  | 'juices-mocktails'
  | 'thickshakes'
  | 'burgers'
  | 'sandwiches'
  | 'wraps'
  | 'veg-appetizers'
  | 'non-veg-appetizers'
  | 'pizza'
  | 'pasta'
  | 'fried-rice-bowls'
  | 'soup-salads'
  | 'waffles-pancakes'
  | 'kunafa-desserts'
  | 'add-ons';

export type ProductBadge =
  | 'Bestseller'
  | 'New'
  | "Chef's Special"
  | 'Popular'
  | 'Special Deal'
  | 'Must Try'
  | 'Hot'
  | 'Healthy'
  | 'Artisanal Crust'
  | 'Freshly Baked'
  | 'Guest Favorite';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // in INR (₹)
  description: string;
  longDescription?: string;
  image: string;
  isVeg: boolean;
  badge?: ProductBadge | null;
  ingredients?: string[];
  portion?: string;
  prepTime?: string;
  calories?: string;
  isFeatured?: boolean;
  menuPage?: number;
  featuredCategory?:
    | 'bestselling-coffee'
    | 'customer-favorites'
    | 'fresh-baked'
    | 'signature-drinks'
    | 'special-combos'
    | null;
}

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
  itemCount?: number;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
