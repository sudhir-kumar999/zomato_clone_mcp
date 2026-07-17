import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import api from '../../api/client'
import { Restaurant } from '../../types'

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    api.get('/admin/restaurants').then(({ data }) => setRestaurants(data)).catch(() => {})
  }, [])

  const refresh = () => api.get('/admin/restaurants').then(({ data }) => setRestaurants(data)).catch(() => {})

  const toggleApprove = async (id: string) => {
    await api.put(`/admin/restaurants/${id}/approve`)
    refresh()
  }

  const toggleActive = async (id: string) => {
    await api.put(`/restaurants/${id}/toggle-active`)
    refresh()
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Manage Restaurants</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.owner?.name || 'N/A'}</TableCell>
                <TableCell>{r.cuisine || '-'}</TableCell>
                <TableCell><Chip label={r.is_active ? 'Active' : 'Inactive'} color={r.is_active ? 'success' : 'default'} size="small" /></TableCell>
                <TableCell><Chip label={r.is_approved ? 'Approved' : 'Pending'} color={r.is_approved ? 'success' : 'warning'} size="small" /></TableCell>
                <TableCell>
                  <Button size="small" onClick={() => toggleApprove(r.id)}>
                    {r.is_approved ? 'Unapprove' : 'Approve'}
                  </Button>
                  <Button size="small" onClick={() => toggleActive(r.id)}>
                    {r.is_active ? 'Disable' : 'Enable'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
