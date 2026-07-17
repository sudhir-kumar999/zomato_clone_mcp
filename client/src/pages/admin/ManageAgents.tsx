import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import api from '../../api/client'
import { User } from '../../types'

export default function ManageAgents() {
  const [agents, setAgents] = useState<User[]>([])
  const [dialog, setDialog] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })

  useEffect(() => {
    api.get('/admin/delivery-agents').then(({ data }) => setAgents(data)).catch(() => {})
  }, [])

  const refresh = () => api.get('/admin/delivery-agents').then(({ data }) => setAgents(data)).catch(() => {})

  const addAgent = async () => {
    await api.post('/admin/delivery-agents', form)
    setForm({ name: '', email: '', password: '', phone: '' })
    setDialog(false)
    refresh()
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Delivery Agents</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setDialog(true)}>Add Agent</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.phone || '-'}</TableCell>
                <TableCell>{a.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Delivery Agent</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" sx={{ mt: 1, mb: 2 }} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Email" type="email" sx={{ mb: 2 }} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField fullWidth label="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button onClick={addAgent} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
