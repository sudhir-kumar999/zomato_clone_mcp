import { useState } from 'react'
import { Box, Paper, TextField, Button, Typography, Alert, MenuItem } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: 'customer' | 'restaurant_owner' | 'delivery_agent'; phone: string }>({ name: '', email: '', password: '', role: 'customer', phone: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" sx={{ mb: 2 }}
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <TextField fullWidth label="Email" type="email" sx={{ mb: 2 }}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <TextField fullWidth label="Phone" sx={{ mb: 2 }}
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField fullWidth select label="Role" sx={{ mb: 2 }}
            value={form.role}             onChange={(e) => setForm({ ...form, role: e.target.value as 'customer' | 'restaurant_owner' | 'delivery_agent' })}>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="restaurant_owner">Restaurant Owner</MenuItem>
            <MenuItem value="delivery_agent">Delivery Agent</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" type="submit" size="large">
            Register
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
