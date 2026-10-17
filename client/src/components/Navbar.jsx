import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import { IconMenu, IconClose } from './icons.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/#features', label: 'Features' },
  { to: '/#about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-moss-100 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.to} className="text-sm font-medium text-stem transition-colors hover:text-moss-800">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-semibold text-moss-800 hover:text-moss-900">
            Log in
          </Link>
          <Link to="/signup" className="btn-primary !px-5 !py-2.5">
            Sign up
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-moss-100 bg-canvas px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.label} href={l.to} className="text-sm font-medium text-stem" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <hr className="border-moss-100" />
            <Link to="/login" className="text-sm font-semibold text-moss-800" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link to="/signup" className="btn-primary w-full" onClick={() => setOpen(false)}>
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
