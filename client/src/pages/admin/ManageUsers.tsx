import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import api from '../../api/client'
import { User } from '../../types'

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => {})
  }, [])

  const refresh = () => api.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => {})

  const toggleBan = async (id: string) => {
    await api.put(`/admin/users/${id}/ban`)
    refresh()
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Manage Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Chip label={u.role} size="small" /></TableCell>
                <TableCell><Chip label={u.is_active ? 'Active' : 'Banned'} color={u.is_active ? 'success' : 'error'} size="small" /></TableCell>
                <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="small" color={u.is_active ? 'error' : 'success'} onClick={() => toggleBan(u.id)}>
                    {u.is_active ? 'Ban' : 'Unban'}
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
