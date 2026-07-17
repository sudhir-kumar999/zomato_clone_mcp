import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Paper, Chip, Stepper, Step, StepLabel, List, ListItem, ListItemText, Divider } from '@mui/material'
import { io } from 'socket.io-client'
import api from '../api/client'
import MapView from '../components/MapView'
import { Order } from '../types'

const steps = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Picked Up', 'Out for Delivery', 'Delivered']
const statusMap: Record<string, number> = { pending: 0, confirmed: 1, preparing: 2, ready_for_pickup: 3, picked_up: 4, out_for_delivery: 5, delivered: 6, cancelled: -1 }

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [agentPos, setAgentPos] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    if (!id) return
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => {})

    const socket = io()
    socket.emit('join-order', id)
    socket.on('delivery-location', (data: { latitude: number; longitude: number }) => setAgentPos(data))
    socket.on('order-status-changed', (data: { orderId: string; status: string }) => {
      setOrder((prev) => prev ? { ...prev, status: data.status } : prev)
    })
    return () => { socket.disconnect() }
  }, [id])

  if (!order) return <Typography>Loading...</Typography>

  const activeStep = statusMap[order.status] ?? -1
  const isCancelled = order.status === 'cancelled'

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Order #{order.id.slice(0, 8)}
        </Typography>
        <Chip label={order.status.replace('_', ' ')} color={isCancelled ? 'error' : 'primary'} sx={{ mb: 2 }} />
        {!isCancelled ? (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        ) : (
          <Typography color="error" fontWeight={600}>Order Cancelled</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Delivery Address</Typography>
        <Typography>{order.delivery_address}</Typography>
      </Paper>

      {(activeStep >= 3 || agentPos) && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Live Tracking</Typography>
          <MapView
            restaurantLat={order.restaurant?.latitude}
            restaurantLng={order.restaurant?.longitude}
            deliveryLat={order.delivery_lat}
            deliveryLng={order.delivery_lng}
            agentLat={agentPos?.latitude}
            agentLng={agentPos?.longitude}
          />
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Order Items</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {order.restaurant?.name}
        </Typography>
        <List disablePadding>
          {order.items?.map((item) => (
            <ListItem key={item.id} sx={{ px: 0 }}>
              <ListItemText primary={item.menu_item?.name} secondary={`Qty: ${item.quantity}`} />
              <Typography>${(Number(item.unit_price) * item.quantity).toFixed(2)}</Typography>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">${Number(order.total_amount).toFixed(2)}</Typography>
        </Box>
      </Paper>
    </Box>
  )
}
