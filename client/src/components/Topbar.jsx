import { IconSearch, IconBell, IconMenu } from './icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Topbar({ title, onMenuClick }) {
  const { user } = useAuth()
  const initials = (user?.name || '?').split(' ').filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join('')

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-moss-100 bg-canvas/90 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-1.5 text-stem lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
          <IconMenu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <label className="relative hidden sm:block">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stem/60" />
          <input
            type="text"
            placeholder="Search readings, alerts…"
            className="w-56 rounded-full border border-moss-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stem/60 focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-100"
          />
        </label>

        <button className="relative rounded-full p-2 text-stem hover:bg-moss-50 hover:text-moss-800" aria-label="Notifications">
          <IconBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2.5 rounded-full border border-moss-100 bg-white py-1 pl-1 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-700 text-xs font-semibold text-white">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-ink leading-tight">{user?.name}</p>
            <p className="max-w-[160px] truncate text-[11px] text-stem/70 leading-tight">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
