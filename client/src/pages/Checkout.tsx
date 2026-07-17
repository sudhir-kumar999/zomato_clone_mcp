import { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Divider, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

export default function Checkout() {
  const { items, restaurant, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!address) return alert('Please enter delivery address')
    if (!restaurant) return
    setLoading(true)
    try {
      const orderItems = items.map((i) => ({ menu_item_id: i.id, quantity: i.quantity }))
      const { data: order } = await api.post('/orders', {
        restaurant_id: restaurant.id,
        items: orderItems,
        delivery_address: address,
      })

      const { data: razorpayOrder } = await api.post('/payments/create-order', {
        order_id: order.id,
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'FoodExpress',
        description: `Order from ${restaurant.name}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          await api.post('/payments/verify', response)
          clearCart()
          navigate(`/order/${order.id}`)
        },
        prefill: { email: user?.email, contact: user?.phone || '' },
        theme: { color: '#e23744' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      alert('Payment failed: ' + (err.response?.data?.message || 'Error'))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return <Navigate to="/" replace />
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Checkout</Typography>
        <Typography variant="subtitle1" fontWeight={600}>{restaurant?.name}</Typography>
        <Divider sx={{ my: 2 }} />
        <List disablePadding>
          {items.map((item) => (
            <ListItem key={item.id} sx={{ px: 0 }}>
              <ListItemText primary={item.name} secondary={`Qty: ${item.quantity}`} />
              <Typography>${(Number(item.price) * item.quantity).toFixed(2)}</Typography>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </Box>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <TextField fullWidth multiline rows={3} label="Delivery Address"
          value={address} onChange={(e) => setAddress(e.target.value)} sx={{ mb: 2 }} />
        <Button fullWidth variant="contained" size="large" onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </Button>
      </Paper>
    </Box>
  )
}
