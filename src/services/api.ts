import { Product, KotOrder, RawMaterialEntry } from '../types/product';
import { OfferBanner, WhatsAppInquiry } from '../types/banner';
import { Review } from '../types/review';

const API_BASE = '/api';

export interface ServerHealthResponse {
  status: string;
  service?: string;
  location?: string;
  serverTime?: string;
  uptimeSeconds?: number;
  uptimeFormatted?: string;
  keepAlive?: string;
  preventSleep?: boolean;
  pingIntervalMinutes?: number;
  renderUrl?: string;
}

/**
 * Unified Fullstack API Client for Coffee Land Resto & Cafe
 * Handles communication with Express backend with automatic fallback
 */
export const api = {
  // Check backend server health
  async checkHealth(): Promise<ServerHealthResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return await res.json();
    } catch {
      // Backend offline or starting up
    }
    return null;
  },

  // Manual trigger for keep-alive ping with cache busting
  async pingKeepAlive(): Promise<ServerHealthResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/health?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Backend offline or timeout
    }
    return null;
  },

  // Owner Admin Authentication
  async loginAdmin(credentials: { password?: string; pin?: string }): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch {
      // Offline fallback verification
      const correctPin = '954252';
      const correctPass = 'coffeeland2024';
      if (
        (credentials.pin && credentials.pin.trim() === correctPin) ||
        (credentials.password && credentials.password.trim() === correctPass) ||
        (credentials.password && credentials.password.trim() === correctPin)
      ) {
        return {
          success: true,
          token: `offline_token_${Date.now()}`,
          message: 'Authenticated locally'
        };
      }
      return { success: false, message: 'Invalid credentials. Please enter the correct PIN (954252) or password (coffeeland2024).' };
    }
  },

  // Emergency Stop & Maintenance Mode
  async getMaintenanceSettings(): Promise<{ maintenanceMode: boolean; maintenanceReason?: string; stoppedAt?: string }> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('coffeeland_maintenance_mode', data.maintenanceMode ? 'true' : 'false');
        if (data.maintenanceReason) {
          localStorage.setItem('coffeeland_maintenance_reason', data.maintenanceReason);
        }
        return data;
      }
    } catch {}

    const isLocalMode = localStorage.getItem('coffeeland_maintenance_mode') === 'true';
    const localReason = localStorage.getItem('coffeeland_maintenance_reason') || 'Scheduled maintenance & security updates in progress.';
    return { maintenanceMode: isLocalMode, maintenanceReason: localReason };
  },

  async setMaintenanceSettings(maintenanceMode: boolean, maintenanceReason?: string): Promise<{ success: boolean; maintenanceMode: boolean }> {
    localStorage.setItem('coffeeland_maintenance_mode', maintenanceMode ? 'true' : 'false');
    if (maintenanceReason) {
      localStorage.setItem('coffeeland_maintenance_reason', maintenanceReason);
    }

    try {
      const res = await fetch(`${API_BASE}/settings/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode, maintenanceReason })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API sync failed, saved maintenance status locally:', e);
    }
    return { success: true, maintenanceMode };
  },

  // Products / Menu Items
  async getProducts(): Promise<Product[]> {
    try {
      localStorage.removeItem('coffeeland_products_v1');
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          localStorage.setItem('coffeeland_products_v2', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend unavailable, falling back to local data');
    }
    // Fallback: load from local storage
    try {
      const saved = localStorage.getItem('coffeeland_products_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      // Update in localStorage immediately
      const saved = localStorage.getItem('coffeeland_products_v2');
      if (saved) {
        const list: Product[] = JSON.parse(saved);
        const idx = list.findIndex(p => p.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updates };
          localStorage.setItem('coffeeland_products_v2', JSON.stringify(list));
        }
      }

      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to update product via API:', e);
    }
    return null;
  },

  async addProduct(newProduct: Partial<Product>): Promise<Product | null> {
    const created: Product = {
      id: newProduct.id || `cl-custom-${Date.now()}`,
      name: newProduct.name || 'New Dish / Drink',
      category: (newProduct.category as any) || 'hot-coffee',
      price: Number(newProduct.price) || 99,
      description: newProduct.description || 'Prepared fresh with signature ingredients.',
      longDescription: newProduct.longDescription || newProduct.description || 'Prepared fresh upon order at Coffee Land Resto & Cafe with signature culinary craftsmanship.',
      image: newProduct.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      isVeg: Boolean(newProduct.isVeg),
      badge: newProduct.badge || undefined,
      prepTime: newProduct.prepTime || '10-15 mins',
      portion: newProduct.portion || '1 Serving',
      calories: newProduct.calories || '220 kcal',
      inStock: newProduct.inStock !== false,
      menuPage: newProduct.menuPage || 1,
      isFeatured: Boolean(newProduct.isFeatured),
      featuredCategory: newProduct.featuredCategory || undefined
    };

    // Save into localStorage immediately so it works even offline
    try {
      const saved = localStorage.getItem('coffeeland_products_v2');
      let list: Product[] = saved ? JSON.parse(saved) : [];
      if (list.length === 0) {
        const { PRODUCTS } = await import('../data/products');
        list = [...PRODUCTS];
      }
      list.unshift(created);
      localStorage.setItem('coffeeland_products_v2', JSON.stringify(list));
    } catch (err) {
      console.warn('Failed saving new product to localStorage', err);
    }

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
      if (res.ok) {
        const serverCreated = await res.json();
        return serverCreated;
      }
    } catch (e) {
      console.warn('API offline, product saved locally to client store');
    }
    return created;
  },

  async deleteProduct(id: string): Promise<boolean> {
    // Delete from localStorage immediately
    try {
      const saved = localStorage.getItem('coffeeland_products_v2');
      if (saved) {
        let list: Product[] = JSON.parse(saved);
        list = list.filter(p => p.id !== id);
        localStorage.setItem('coffeeland_products_v2', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed to delete product from localStorage', e);
    }

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API offline, deletion recorded locally');
      return true;
    }
  },

  // Offer Banners
  async getBanners(all = false): Promise<OfferBanner[]> {
    try {
      const res = await fetch(`${API_BASE}/banners?all=${all}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable for banners');
    }
    return [];
  },

  async addBanner(banner: Omit<OfferBanner, 'id'>): Promise<OfferBanner | null> {
    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to add banner via API:', e);
    }
    return null;
  },

  async updateBanner(id: string, updates: Partial<OfferBanner>): Promise<OfferBanner | null> {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to update banner via API:', e);
    }
    return null;
  },

  async deleteBanner(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete banner via API:', e);
      return false;
    }
  },

  // WhatsApp Inquiries
  async getInquiries(): Promise<WhatsAppInquiry[]> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable for inquiries');
    }
    return [];
  },

  async addInquiry(data: {
    customerName?: string;
    customerPhone?: string;
    itemName: string;
    category?: string;
    price: number;
    inquiryType?: string;
    diningOption?: 'Dine-In' | 'Delivery' | 'Takeaway';
    promoCode?: string;
    customNote?: string;
  }): Promise<WhatsAppInquiry | null> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to record inquiry via API:', e);
    }
    return null;
  },

  async updateInquiryStatus(id: string, status: 'Inquired' | 'Confirmed' | 'Completed'): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async deleteInquiry(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async clearInquiries(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Customer Reviews
  async getReviews(): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable for reviews');
    }
    return [];
  },

  async addReview(review: Partial<Review>): Promise<Review | null> {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to submit review via API:', e);
    }
    return null;
  },

  // Counter POS & KOT Orders (Offline Dining, Takeaway, Delivery)
  async getPosOrders(): Promise<KotOrder[]> {
    try {
      const res = await fetch(`${API_BASE}/pos-orders`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable for POS orders');
    }
    return [];
  },

  async addPosOrder(order: Partial<KotOrder>): Promise<KotOrder | null> {
    try {
      const res = await fetch(`${API_BASE}/pos-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to record POS order via API:', e);
    }
    return null;
  },

  async updatePosOrderStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/pos-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async deletePosOrder(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/pos-orders/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async clearPosOrders(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/pos-orders`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Server Excel Download URL Helper
  getExportUrl(type: 'inquiries' | 'banners' | 'menu' | 'pos-orders' | 'daily-sales'): string {
    return `${API_BASE}/export/${type}`;
  },

  // Raw Materials Management
  async getRawMaterials(): Promise<RawMaterialEntry[]> {
    try {
      const res = await fetch(`${API_BASE}/raw-materials`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('coffeeland_raw_materials_v1', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API getRawMaterials failed, using offline fallback', e);
    }
    try {
      const saved = localStorage.getItem('coffeeland_raw_materials_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  },

  async addRawMaterial(item: Partial<RawMaterialEntry>): Promise<RawMaterialEntry | null> {
    const fallbackItem: RawMaterialEntry = {
      id: item.id || `raw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.name || 'Raw Material',
      category: item.category || 'Coffee & Beverages',
      quantity: Number(item.quantity) || 0,
      unit: item.unit || 'kg',
      costRs: Number(item.costRs) || 0,
      status: item.status || 'Required',
      supplier: item.supplier || '',
      date: item.date || new Date().toISOString().split('T')[0],
      notes: item.notes || ''
    };

    let resultItem = fallbackItem;

    try {
      const res = await fetch(`${API_BASE}/raw-materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        resultItem = await res.json();
      }
    } catch (e) {
      console.warn('API addRawMaterial failed, using offline fallback', e);
    }

    try {
      const saved = localStorage.getItem('coffeeland_raw_materials_v1');
      const list: RawMaterialEntry[] = saved ? JSON.parse(saved) : [];
      const filtered = list.filter(m => String(m.id).trim() !== String(resultItem.id).trim());
      filtered.unshift(resultItem);
      localStorage.setItem('coffeeland_raw_materials_v1', JSON.stringify(filtered));
    } catch {}

    return resultItem;
  },

  async updateRawMaterial(id: string, updates: Partial<RawMaterialEntry>): Promise<boolean> {
    const cleanId = String(id).trim();

    try {
      const saved = localStorage.getItem('coffeeland_raw_materials_v1');
      if (saved) {
        const list: RawMaterialEntry[] = JSON.parse(saved);
        const idx = list.findIndex(m => String(m.id).trim() === cleanId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updates };
          localStorage.setItem('coffeeland_raw_materials_v1', JSON.stringify(list));
        }
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/raw-materials/${encodeURIComponent(cleanId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API updateRawMaterial failed, updating local storage', e);
    }
    return true;
  },

  async deleteRawMaterial(id: string): Promise<boolean> {
    const cleanId = String(id).trim();

    // 1. Immediately delete from localStorage cache
    try {
      const saved = localStorage.getItem('coffeeland_raw_materials_v1');
      if (saved) {
        let list: RawMaterialEntry[] = JSON.parse(saved);
        list = list.filter(m => String(m.id).trim() !== cleanId);
        localStorage.setItem('coffeeland_raw_materials_v1', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed to delete from local storage', e);
    }

    // 2. Send DELETE to backend server
    try {
      const res = await fetch(`${API_BASE}/raw-materials/${encodeURIComponent(cleanId)}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API deleteRawMaterial failed, local storage deleted', e);
    }
    return true;
  }
};
