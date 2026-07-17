import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleRoutes: Record<string, string> = {
  admin: '/admin/dashboard',
  restaurant_owner: '/owner/dashboard',
  delivery_agent: '/agent/deliveries',
  customer: '/',
}

export default function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to={roleRoutes[user.role] || '/'} replace />

  return <>{children}</>
}
