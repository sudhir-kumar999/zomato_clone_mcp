import { ReactNode, useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton, Menu, MenuItem } from '@mui/material'
import { ShoppingCart, RestaurantMenu, AccountCircle } from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <RestaurantMenu sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
          >
            FoodExpress
          </Typography>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user.role === 'customer' && (
                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                  <Badge badgeContent={items.length} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              )}
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem disabled>{user.name} ({user.role})</MenuItem>
                {user.role === 'customer' && <MenuItem onClick={() => { navigate('/orders'); setAnchorEl(null) }}>My Orders</MenuItem>}
                {user.role === 'restaurant_owner' && <MenuItem onClick={() => { navigate('/owner/dashboard'); setAnchorEl(null) }}>Dashboard</MenuItem>}
                {user.role === 'delivery_agent' && <MenuItem onClick={() => { navigate('/agent/deliveries'); setAnchorEl(null) }}>Deliveries</MenuItem>}
                {user.role === 'admin' && <MenuItem onClick={() => { navigate('/admin/dashboard'); setAnchorEl(null) }}>Admin Panel</MenuItem>}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button variant="outlined" color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flex: 1 }}>
        {children}
      </Container>
    </Box>
  )
}
