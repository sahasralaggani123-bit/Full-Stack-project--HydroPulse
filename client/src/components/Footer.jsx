import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-moss-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-stem">
              A calm, clear view of every reading your hydroponic system produces — pH, nutrients, temperature, and water level, in one place.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Navigate</p>
            <ul className="mt-3 space-y-2 text-sm text-stem">
              <li><a href="/" className="hover:text-moss-800">Home</a></li>
              <li><a href="/#features" className="hover:text-moss-800">Features</a></li>
              <li><a href="/#about" className="hover:text-moss-800">About</a></li>
              <li><a href="/dashboard" className="hover:text-moss-800">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-stem">
              <li><a href="/login" className="hover:text-moss-800">Log in</a></li>
              <li><a href="/signup" className="hover:text-moss-800">Sign up</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-moss-100 pt-6 text-sm text-stem/80">
          © {new Date().getFullYear()} HydroPulse. Built as a college project — all data shown is for demonstration only.
        </div>
      </div>
    </footer>
  )
}
