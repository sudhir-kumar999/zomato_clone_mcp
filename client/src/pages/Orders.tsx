import { useState, useEffect } from 'react'
import { List, ListItem, ListItemText, Typography, Chip, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { Order } from '../types'

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning', confirmed: 'info', preparing: 'info', ready_for_pickup: 'primary',
  picked_up: 'primary', out_for_delivery: 'secondary', delivered: 'success', cancelled: 'error',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {})
  }, [])

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>My Orders</Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">No orders yet</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <ListItem key={order.id} divider sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/order/${order.id}`)}>
              <ListItemText
                primary={`${order.restaurant?.name} — $${Number(order.total_amount).toFixed(2)}`}
                secondary={new Date(order.created_at).toLocaleDateString()}
              />
              <Chip label={order.status.replace('_', ' ')} color={statusColors[order.status] || 'default'} size="small" />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  )
}
