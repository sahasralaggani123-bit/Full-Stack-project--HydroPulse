import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-stem">Loading…</div>
  )
}

// Dashboard pages: must be logged in.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? children : <Navigate to="/login" replace />
}

// Login / Signup pages: skip them if already logged in.
export function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  return user ? <Navigate to="/dashboard" replace /> : children
}
