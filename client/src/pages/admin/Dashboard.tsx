import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  if (!stats) return <Typography>Loading...</Typography>

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: '#1976d2', link: '/admin/users' },
    { label: 'Total Restaurants', value: stats.totalRestaurants, color: '#388e3c', link: '/admin/restaurants' },
    { label: 'Active Restaurants', value: stats.activeRestaurants, color: '#f57c00', link: '/admin/restaurants' },
    { label: 'Total Orders', value: stats.totalOrders, color: '#7b1fa2', link: '/admin/orders' },
    { label: 'Total Revenue', value: `$${Number(stats.totalRevenue).toFixed(2)}`, color: '#d32f2f', link: '/admin/orders' },
  ]

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Paper
              sx={{ p: 3, cursor: 'pointer', borderLeft: `4px solid ${card.color}`, '&:hover': { transform: 'scale(1.02)', transition: '0.2s' } }}
              onClick={() => navigate(card.link)}
            >
              <Typography variant="body2" color="text.secondary">{card.label}</Typography>
              <Typography variant="h4" fontWeight={700}>{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
