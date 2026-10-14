import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'cash_on_delivery';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: DeliveryAddress[];
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  landmark?: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress?: DeliveryAddress;
  tableNumber?: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  createdAt: string;
  updatedAt: string;
}
