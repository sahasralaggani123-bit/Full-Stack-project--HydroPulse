import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, ask the server whether we are already logged in.
  useEffect(() => {
    api
      .get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // Dark mode is stored per user in PostgreSQL; apply it to the whole page.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', !!user?.darkMode)
  }, [user?.darkMode])

  const login = async (email, password) => {
    const d = await api.post('/auth/login', { email, password })
    setUser(d.user)
  }

  const signup = async (name, email, password) => {
    const d = await api.post('/auth/signup', { name, email, password })
    setUser(d.user)
  }

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {})
    setUser(null)
  }

  const updateUser = (changes) => setUser((u) => (u ? { ...u, ...changes } : u))

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
