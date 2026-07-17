import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Paper, Chip, Button, List, ListItem, ListItemText, Divider } from '@mui/material'
import api from '../../api/client'
import { Order } from '../../types'
import { useAuth } from '../../context/AuthContext'

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning', confirmed: 'info', preparing: 'info', ready_for_pickup: 'primary',
  picked_up: 'primary', out_for_delivery: 'secondary', delivered: 'success', cancelled: 'error',
}

export default function AgentDeliveries() {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useAuth()

  const loadOrders = useCallback(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {})
  }, [])

  useEffect(loadOrders, [loadOrders])

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/orders/${id}/status`, { status })
    loadOrders()
  }

  const claimAndPickUp = async (id: string) => {
    await api.put(`/orders/${id}/assign-delivery`, { delivery_agent_id: user!.id })
    await api.put(`/orders/${id}/status`, { status: 'picked_up' })
    loadOrders()
  }

  const sendLocation = async (orderId: string) => {
    if (!navigator.geolocation) return alert('Geolocation not available')
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await api.post('/tracking/location', {
        order_id: orderId,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
    })
  }

  const available = orders.filter((o) => !o.delivery_agent_id && o.status === 'ready_for_pickup')
  const myDeliveries = orders.filter((o) => o.delivery_agent_id === user?.id)

  return (
    <Box>
      {available.length > 0 && (
        <>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Available Pickups</Typography>
          <List sx={{ mb: 3 }}>
            {available.map((order) => (
              <Paper key={order.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={`${order.restaurant?.name} → ${order.customer?.name}`}
                    secondary={`${order.delivery_address} | $${Number(order.total_amount).toFixed(2)}`}
                  />
                  <Button size="small" color="success" variant="contained" onClick={() => claimAndPickUp(order.id)}>
                    Accept & Pick Up
                  </Button>
                </ListItem>
              </Paper>
            ))}
          </List>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>My Deliveries</Typography>
      {myDeliveries.length === 0 ? (
        <Typography color="text.secondary">No deliveries assigned</Typography>
      ) : (
        <List>
          {myDeliveries.map((order) => (
            <Paper key={order.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={`${order.restaurant?.name} → ${order.customer?.name}`}
                  secondary={`${order.delivery_address} | $${Number(order.total_amount).toFixed(2)}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={order.status.replace('_', ' ')} color={statusColors[order.status] || 'default'} />
                  {order.status === 'ready_for_pickup' && (
                    <Button size="small" color="primary" onClick={() => updateStatus(order.id, 'picked_up')}>
                      Picked Up
                    </Button>
                  )}
                  {order.status === 'picked_up' && (
                    <Button size="small" color="secondary" onClick={() => updateStatus(order.id, 'out_for_delivery')}>
                      Out for Delivery
                    </Button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <>
                      <Button size="small" color="success" onClick={() => updateStatus(order.id, 'delivered')}>
                        Delivered
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => sendLocation(order.id)}>
                        Share Location
                      </Button>
                    </>
                  )}
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  )
}
