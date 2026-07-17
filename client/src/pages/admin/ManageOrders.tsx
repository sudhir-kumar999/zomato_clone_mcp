import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Chip, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl } from '@mui/material'
import api from '../../api/client'
import { Order, User } from '../../types'

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning', confirmed: 'info', preparing: 'info', ready_for_pickup: 'primary',
  picked_up: 'primary', out_for_delivery: 'secondary', delivered: 'success', cancelled: 'error',
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [assigning, setAssigning] = useState<string | null>(null)

  const load = () => {
    api.get('/orders').then(({ data }) => setOrders(data)).catch(() => {})
    api.get('/admin/delivery-agents').then(({ data }) => setAgents(data)).catch(() => {})
  }
  useEffect(load, [])

  const assignAgent = async (orderId: string, agentId: string) => {
    if (!agentId) return
    await api.put(`/orders/${orderId}/assign-delivery`, { delivery_agent_id: agentId })
    setAssigning(null)
    load()
  }

  const unassignAgent = async (orderId: string) => {
    await api.put(`/orders/${orderId}/assign-delivery`, { delivery_agent_id: null })
    load()
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Manage Orders</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Restaurant</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id.slice(0, 8)}</TableCell>
                <TableCell>{o.customer?.name}</TableCell>
                <TableCell>{o.restaurant?.name}</TableCell>
                <TableCell>${Number(o.total_amount).toFixed(2)}</TableCell>
                <TableCell><Chip label={o.status.replace('_', ' ')} color={statusColors[o.status] || 'default'} size="small" /></TableCell>
                <TableCell><Chip label={o.payment_status} color={o.payment_status === 'paid' ? 'success' : 'warning'} size="small" /></TableCell>
                <TableCell>{o.delivery_agent?.name || 'Unassigned'}</TableCell>
                <TableCell>
                  {!o.delivery_agent_id ? (
                    assigning === o.id ? (
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          displayEmpty
                          defaultValue=""
                          onChange={(e) => assignAgent(o.id, e.target.value)}
                        >
                          <MenuItem value="" disabled>Select agent...</MenuItem>
                          {agents.map((a) => (
                            <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Button size="small" onClick={() => setAssigning(o.id)}>Assign Agent</Button>
                    )
                  ) : (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {assigning === o.id ? (
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <Select displayEmpty defaultValue="" onChange={(e) => assignAgent(o.id, e.target.value)}>
                            <MenuItem value="" disabled>Select agent...</MenuItem>
                            {agents.map((a) => (
                              <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Button size="small" onClick={() => setAssigning(o.id)}>Change</Button>
                      )}
                      <Button size="small" color="error" onClick={() => unassignAgent(o.id)}>Unassign</Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
