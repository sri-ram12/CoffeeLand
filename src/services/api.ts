import { Product } from '../types/product';
import { OfferBanner, WhatsAppInquiry } from '../types/banner';
import { Review } from '../types/review';

const API_BASE = '/api';

/**
 * Unified Fullstack API Client for Coffee Land Resto & Cafe
 * Handles communication with Express backend with automatic fallback
 */
export const api = {
  // Check backend server health
  async checkHealth(): Promise<{ status: string; uptime?: number } | null> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // Backend offline or starting up
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

  // Products / Menu Items
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend unavailable, falling back to local data');
    }
    // Fallback: load from local storage or default
    return [];
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
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
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to add product via API:', e);
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete product via API:', e);
      return false;
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

  // Server Excel Download URL Helper
  getExportUrl(type: 'inquiries' | 'banners' | 'menu'): string {
    return `${API_BASE}/export/${type}`;
  }
};
