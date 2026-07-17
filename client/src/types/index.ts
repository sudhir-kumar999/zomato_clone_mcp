export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'restaurant_owner' | 'delivery_agent' | 'admin'
  is_active: boolean
  created_at: string
}

export interface Restaurant {
  id: string
  name: string
  description?: string
  cuisine?: string
  address?: string
  latitude?: number
  longitude?: number
  cover_image?: string
  is_active: boolean
  is_approved: boolean
  commission_rate: number
  created_at: string
  owner_id: string
  owner?: User
  categories?: MenuCategory[]
}

export interface MenuCategory {
  id: string
  name: string
  sort_order: number
  restaurant_id: string
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number | string
  image?: string
  is_available: boolean
  is_vegetarian: boolean
  restaurant_id: string
  category_id: string
}

export interface Order {
  id: string
  status: string
  total_amount: number | string
  delivery_address: string
  delivery_lat?: number
  delivery_lng?: number
  payment_status: string
  razorpay_order_id?: string
  created_at: string
  customer_id: string
  restaurant_id: string
  delivery_agent_id?: string
  customer?: User
  restaurant?: Restaurant
  delivery_agent?: User
  items?: OrderItem[]
  tracking?: DeliveryTracking[]
}

export interface OrderItem {
  id: string
  quantity: number
  unit_price: number | string
  menu_item_id: string
  menu_item?: MenuItem
}

export interface DeliveryTracking {
  id: string
  latitude: number
  longitude: number
  timestamp: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

declare global {
  interface Window {
    Razorpay: any
  }
}
