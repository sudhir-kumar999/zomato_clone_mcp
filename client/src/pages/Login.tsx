import { useState } from 'react'
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const u = await login(form.email, form.password)
      if (u.role === 'admin') navigate('/admin/dashboard', { replace: true })
      else if (u.role === 'restaurant_owner') navigate('/owner/dashboard', { replace: true })
      else if (u.role === 'delivery_agent') navigate('/agent/deliveries', { replace: true })
      else navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" sx={{ mb: 2 }}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button fullWidth variant="contained" type="submit" size="large">
            Login
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
