import { Box, Typography, Paper, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material'
import { Add, Remove, Delete } from '@mui/icons-material'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, restaurant, total, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" color="text.secondary">Your cart is empty</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Browse Restaurants</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Your Cart</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>{restaurant?.name}</Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item.id} sx={{ px: 0 }}>
              <ListItemText primary={item.name} secondary={`$${Number(item.price).toFixed(2)} each`} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Remove /></IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Add /></IconButton>
                <IconButton size="small" color="error" onClick={() => removeItem(item.id)}><Delete /></IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </Box>
      </Paper>
      <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </Button>
    </Box>
  )
}
