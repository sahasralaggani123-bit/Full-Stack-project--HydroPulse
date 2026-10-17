import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import { IconGrid, IconActivity, IconClock, IconBell, IconSettings, IconLogout, IconClose } from './icons.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
  { to: '/monitoring', label: 'Monitoring', icon: IconActivity },
  { to: '/history', label: 'History', icon: IconClock },
  { to: '/alerts', label: 'Alerts', icon: IconBell },
  { to: '/settings', label: 'Settings', icon: IconSettings },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-moss-100 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/dashboard">
            <Logo />
          </Link>
          <button className="rounded-lg p-1.5 text-stem lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-moss-700 text-white' : 'text-stem hover:bg-moss-50 hover:text-moss-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-moss-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stem hover:bg-moss-50 hover:text-moss-800"
          >
            <IconLogout className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
