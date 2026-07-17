import { useState, useEffect } from 'react'
import { Grid, Card, CardContent, CardMedia, Typography, Chip, Box, TextField, InputAdornment } from '@mui/material'
import { Search, Restaurant } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { Restaurant as RestaurantType } from '../types'

export default function Landing() {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/restaurants').then(({ data }) => setRestaurants(data)).catch(() => {})
  }, [])

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search restaurants or cuisines..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
        }}
      />
      <Grid container spacing={3}>
        {filtered.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.02)', transition: '0.2s' } }}
              onClick={() => navigate(`/restaurant/${r.id}`)}>
              <CardMedia
                component="img"
                height="160"
                image={r.cover_image || `https://source.unsplash.com/400x200/?restaurant,${r.cuisine || 'food'}`}
                alt={r.name}
              />
              <CardContent>
                <Typography variant="h6">{r.name}</Typography>
                <Typography variant="body2" color="text.secondary">{r.description}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Chip icon={<Restaurant />} label={r.cuisine || 'Various'} size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
              No restaurants found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
