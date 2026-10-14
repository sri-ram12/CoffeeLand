import { useState, useEffect, useCallback } from 'react';
import { Product, Category, CategoryId, SortOption } from '../types/product';
import { menuService } from '../services/menuService';

export function useMenu(favoriteIds: string[]) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [vegOnly, setVegOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load of categories and base products
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        menuService.getCategories(),
        menuService.getProducts(),
      ]);
      if (mounted) {
        setCategories(cats);
        setAllProducts(prods);
        setFilteredProducts(prods);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter and sort products whenever query parameters change
  useEffect(() => {
    let mounted = true;
    async function updateList() {
      const results = await menuService.filterProducts({
        category: selectedCategory,
        searchQuery,
        sortBy,
        vegOnly,
        favoritesOnly,
        favoriteIds,
      });
      if (mounted) {
        setFilteredProducts(results);
      }
    }
    updateList();
    return () => {
      mounted = false;
    };
  }, [selectedCategory, searchQuery, sortBy, vegOnly, favoritesOnly, favoriteIds]);

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setVegOnly(false);
    setFavoritesOnly(false);
  }, []);

  return {
    categories,
    allProducts,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    vegOnly,
    setVegOnly,
    favoritesOnly,
    setFavoritesOnly,
    selectedProduct,
    setSelectedProduct,
    loading,
    resetFilters,
  };
}
