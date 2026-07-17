import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Card, CardContent, Chip, IconButton, Divider } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Restaurant } from '../types'

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const { user } = useAuth()
  const { items, addItem, updateQuantity } = useCart()

  useEffect(() => {
    if (id) {
      api.get(`/restaurants/${id}`).then(({ data }) => setRestaurant(data)).catch(() => {})
    }
  }, [id])

  if (!restaurant) return <Typography>Loading...</Typography>

  const getItemQty = (itemId: string) => {
    return items.find((i) => i.id === itemId)?.quantity || 0
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>{restaurant.name}</Typography>
        <Typography variant="body1" color="text.secondary">{restaurant.description}</Typography>
        <Chip label={restaurant.cuisine || 'Various'} sx={{ mt: 1 }} />
      </Box>
      <Divider sx={{ mb: 3 }} />
      {restaurant.categories?.map((category) => (
        <Box key={category.id} sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>{category.name}</Typography>
          {category.items?.map((item) => {
            const qty = getItemQty(item.id)
            return (
              <Card key={item.id} sx={{ mb: 1, opacity: item.is_available ? 1 : 0.5 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1">{item.name} {item.is_vegetarian && <Chip label="🥦" size="small" />}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                    <Typography variant="subtitle2" color="primary" sx={{ mt: 0.5 }}>${Number(item.price).toFixed(2)}</Typography>
                  </Box>
                  {user?.role === 'customer' && item.is_available && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {qty > 0 && (
                        <IconButton size="small" onClick={() => updateQuantity(item.id, qty - 1)}>
                          <Remove />
                        </IconButton>
                      )}
                      {qty > 0 && <Typography sx={{ mx: 1 }}>{qty}</Typography>}
                      <IconButton size="small" onClick={() => addItem(item, restaurant)} color="primary">
                        <Add />
                      </IconButton>
                    </Box>
                  )}
                  {!item.is_available && <Chip label="Unavailable" size="small" color="error" />}
                </CardContent>
              </Card>
            )
          })}
        </Box>
      ))}
    </Box>
  )
}
