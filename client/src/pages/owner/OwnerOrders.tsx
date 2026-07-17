import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Chip, Button, List, ListItem, ListItemText } from '@mui/material'
import api from '../../api/client'
import { Order } from '../../types'

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning', confirmed: 'info', preparing: 'info', ready_for_pickup: 'primary',
  picked_up: 'primary', out_for_delivery: 'secondary', delivered: 'success', cancelled: 'error',
}

export default function OwnerOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  const loadOrders = () => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {})
  }

  useEffect(loadOrders, [])

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/orders/${id}/status`, { status })
    loadOrders()
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Restaurant Orders</Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">No orders yet</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={`${order.restaurant?.name} — $${Number(order.total_amount).toFixed(2)}`}
                  secondary={`${order.customer?.name} | ${order.delivery_address} | ${new Date(order.created_at).toLocaleString()}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={order.status.replace('_', ' ')} color={statusColors[order.status] || 'default'} />
                  {order.status === 'pending' && <Button size="small" color="success" onClick={() => updateStatus(order.id, 'confirmed')}>Confirm</Button>}
                  {order.status === 'confirmed' && <Button size="small" color="info" onClick={() => updateStatus(order.id, 'preparing')}>Preparing</Button>}
                  {order.status === 'preparing' && <Button size="small" color="primary" onClick={() => updateStatus(order.id, 'ready_for_pickup')}>Ready for Pickup</Button>}
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  )
}
