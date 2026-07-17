import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import OwnerDashboard from './pages/owner/Dashboard'
import MenuManagement from './pages/owner/MenuManagement'
import OwnerOrders from './pages/owner/OwnerOrders'
import AgentDeliveries from './pages/agent/Deliveries'
import AdminDashboard from './pages/admin/Dashboard'
import ManageRestaurants from './pages/admin/ManageRestaurants'
import ManageUsers from './pages/admin/ManageUsers'
import ManageOrders from './pages/admin/ManageOrders'
import ManageAgents from './pages/admin/ManageAgents'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute roles={['customer']}><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['customer']}><Orders /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

        <Route path="/owner/dashboard" element={<ProtectedRoute roles={['restaurant_owner']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/menu" element={<ProtectedRoute roles={['restaurant_owner']}><MenuManagement /></ProtectedRoute>} />
        <Route path="/owner/orders" element={<ProtectedRoute roles={['restaurant_owner']}><OwnerOrders /></ProtectedRoute>} />

        <Route path="/agent/deliveries" element={<ProtectedRoute roles={['delivery_agent']}><AgentDeliveries /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/restaurants" element={<ProtectedRoute roles={['admin']}><ManageRestaurants /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><ManageOrders /></ProtectedRoute>} />
        <Route path="/admin/delivery-agents" element={<ProtectedRoute roles={['admin']}><ManageAgents /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}
