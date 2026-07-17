import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, MenuItem, Restaurant } from '../types'

interface CartContextType {
  items: CartItem[]
  restaurant: Restaurant | null
  total: number
  addItem: (item: MenuItem, restaurant: Restaurant) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  const addItem = (item: MenuItem, restaurantData: Restaurant) => {
    if (restaurant && restaurant.id !== restaurantData.id) {
      setItems([])
    }
    setRestaurant(restaurantData)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    if (items.length === 1) setRestaurant(null)
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    setRestaurant(null)
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, restaurant, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
