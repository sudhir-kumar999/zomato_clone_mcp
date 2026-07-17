import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem as MuiMenuItem } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { Restaurant, MenuCategory, MenuItem as MenuItemType } from '../../types'
import api from '../../api/client'

export default function MenuManagement() {
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRest, setSelectedRest] = useState<string>('')
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [catDialog, setCatDialog] = useState(false)
  const [itemDialog, setItemDialog] = useState(false)
  const [catName, setCatName] = useState('')
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', category_id: '', is_vegetarian: false })

  useEffect(() => {
    api.get('/restaurants').then(({ data }) => {
      const owned = data.filter((r: Restaurant) => r.owner_id === user?.id)
      setRestaurants(owned)
      if (owned.length > 0) setSelectedRest(owned[0].id)
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    if (selectedRest) {
      api.get(`/menu/restaurant/${selectedRest}`).then(({ data }) => setCategories(data)).catch(() => {})
    }
  }, [selectedRest])

  const addCategory = async () => {
    if (!catName || !selectedRest) return
    await api.post('/menu/category', { restaurant_id: selectedRest, name: catName })
    setCatName('')
    setCatDialog(false)
    const { data } = await api.get(`/menu/restaurant/${selectedRest}`)
    setCategories(data)
  }

  const deleteCategory = async (id: string) => {
    await api.delete(`/menu/category/${id}`)
    const { data } = await api.get(`/menu/restaurant/${selectedRest}`)
    setCategories(data)
  }

  const addItem = async () => {
    if (!selectedRest) return
    await api.post('/menu/item', { ...itemForm, price: parseFloat(itemForm.price), restaurant_id: selectedRest })
    setItemForm({ name: '', description: '', price: '', category_id: '', is_vegetarian: false })
    setItemDialog(false)
    const { data } = await api.get(`/menu/restaurant/${selectedRest}`)
    setCategories(data)
  }

  const toggleItem = async (item: MenuItemType) => {
    await api.put(`/menu/item/${item.id}/toggle-availability`)
    const { data } = await api.get(`/menu/restaurant/${selectedRest}`)
    setCategories(data)
  }

  const deleteItem = async (id: string) => {
    await api.delete(`/menu/item/${id}`)
    const { data } = await api.get(`/menu/restaurant/${selectedRest}`)
    setCategories(data)
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Menu Management</Typography>

      <TextField select label="Select Restaurant" value={selectedRest} onChange={(e) => setSelectedRest(e.target.value)}
        sx={{ mb: 2, minWidth: 300 }}>
        {restaurants.map((r) => <MuiMenuItem key={r.id} value={r.id}>{r.name}</MuiMenuItem>)}
      </TextField>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={() => setCatDialog(true)}>Add Category</Button>
        <Button variant="outlined" onClick={() => setItemDialog(true)}>Add Item</Button>
      </Box>

      {categories.map((cat) => (
        <Paper key={cat.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">{cat.name}</Typography>
            <Button size="small" color="error" onClick={() => deleteCategory(cat.id)}>Delete</Button>
          </Box>
          {cat.items?.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, px: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 0.5 }}>
              <Box>
                <Typography variant="body1">
                  {item.name} — ${Number(item.price).toFixed(2)}
                  {item.is_vegetarian && ' 🌱'}
                </Typography>
                <Typography variant="caption" color="text.secondary">{item.description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" color={item.is_available ? 'warning' : 'success'} onClick={() => toggleItem(item)}>
                  {item.is_available ? 'Disable' : 'Enable'}
                </Button>
                <Button size="small" color="error" onClick={() => deleteItem(item.id)}>Delete</Button>
              </Box>
            </Box>
          ))}
        </Paper>
      ))}

      <Dialog open={catDialog} onClose={() => setCatDialog(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Category Name" value={catName}
            onChange={(e) => setCatName(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCatDialog(false)}>Cancel</Button>
          <Button onClick={addCategory} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" sx={{ mt: 1, mb: 2 }}
            value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />
          <TextField fullWidth label="Description" sx={{ mb: 2 }}
            value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
          <TextField fullWidth label="Price" type="number" sx={{ mb: 2 }}
            value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} />
          <TextField select fullWidth label="Category" sx={{ mb: 2 }}
            value={itemForm.category_id} onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}>
            {categories.map((c) => <MuiMenuItem key={c.id} value={c.id}>{c.name}</MuiMenuItem>)}
          </TextField>
          <TextField select fullWidth label="Vegetarian"
            value={itemForm.is_vegetarian ? 'yes' : 'no'}
            onChange={(e) => setItemForm({ ...itemForm, is_vegetarian: e.target.value === 'yes' })}>
            <MuiMenuItem value="no">No</MuiMenuItem>
            <MuiMenuItem value="yes">Yes</MuiMenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog(false)}>Cancel</Button>
          <Button onClick={addItem} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
