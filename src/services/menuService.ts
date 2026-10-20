import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product, Category, CategoryId, SortOption } from '../types/product';

/**
 * MenuService provides an abstraction layer over product and category data.
 * When COFFEE LAND transitions to a full-stack platform, this service can be
 * swapped to query a REST/GraphQL backend API without changing UI components.
 */
class MenuService {
  private products: Product[] = PRODUCTS;
  private categories: Category[] = CATEGORIES;

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<Category[]> {
    return Promise.resolve(this.categories);
  }

  /**
   * Fetch all menu products
   */
  async getProducts(): Promise<Product[]> {
    try {
      const saved = localStorage.getItem('coffeeland_products_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          this.products = parsed;
          return this.products;
        }
      }
    } catch {}
    return Promise.resolve(this.products);
  }

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product | undefined> {
    await this.getProducts();
    const product = this.products.find((p) => p.id === id);
    return Promise.resolve(product);
  }

  /**
   * Filter and sort products according to criteria
   */
  async filterProducts(options: {
    category?: CategoryId;
    searchQuery?: string;
    sortBy?: SortOption;
    vegOnly?: boolean;
    favoritesOnly?: boolean;
    favoriteIds?: string[];
  }): Promise<Product[]> {
    await this.getProducts();
    let result = [...this.products];

    // Filter by Category
    if (options.category && options.category !== 'all') {
      result = result.filter((p) => p.category === options.category);
    }

    // Filter by Search query
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter Veg Only
    if (options.vegOnly) {
      result = result.filter((p) => p.isVeg);
    }

    // Filter Favorites
    if (options.favoritesOnly && options.favoriteIds) {
      const set = new Set(options.favoriteIds);
      result = result.filter((p) => set.has(p.id));
    }

    // Sort
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'featured':
        default:
          // Keep default curated arrangement or prioritize badges
          result.sort((a, b) => {
            const score = (p: Product) => (p.badge === 'Bestseller' ? 2 : p.badge ? 1 : 0);
            return score(b) - score(a);
          });
          break;
      }
    }

    return Promise.resolve(result);
  }

  /**
   * Fetch featured products for designated highlight sections
   */
  async getFeaturedProducts(
    section: 'bestselling-coffee' | 'customer-favorites' | 'fresh-baked' | 'signature-drinks' | 'special-combos'
  ): Promise<Product[]> {
    const featured = this.products.filter((p) => p.featuredCategory === section);
    return Promise.resolve(featured);
  }
}

export const menuService = new MenuService();
