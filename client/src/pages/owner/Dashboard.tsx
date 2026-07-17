import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Restaurant, Order } from '../../types'
import api from '../../api/client'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    api.get('/restaurants').then(({ data }) => {
      setRestaurants(data.filter((r: Restaurant) => r.owner_id === user?.id))
    }).catch(() => {})
  }, [user])

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Owner Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Your Restaurants</Typography>
            {restaurants.length === 0 ? (
              <Typography color="text.secondary">No restaurants yet. Create one!</Typography>
            ) : (
              restaurants.map((r) => (
                <Card key={r.id} sx={{ mb: 2 }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{r.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {r.is_approved ? (r.is_active ? 'Active' : 'Inactive') : 'Pending Approval'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => navigate('/owner/menu')}>
                        Menu
                      </Button>
                      <Button size="small" variant="outlined" onClick={() => navigate('/owner/orders')}>
                        Orders
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => navigate('/owner/menu')}>
              Manage Menu
            </Button>
            <Button fullWidth variant="outlined" onClick={() => navigate('/owner/orders')}>
              View Orders
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
