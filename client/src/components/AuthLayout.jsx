import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { IconDroplet, IconFlask, IconThermo } from './icons.jsx'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 inline-block">
          <Logo />
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-stem">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-center text-sm text-stem">{footer}</p>

          <Link to="/" className="mt-6 block text-center text-sm font-medium text-moss-700 hover:text-moss-900">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-moss-800 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-moss-700 via-moss-800 to-moss-950" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div>
            <p className="text-sm font-medium text-moss-100">Live reservoir snapshot</p>
            <p className="mt-2 max-w-xs text-2xl font-display font-semibold leading-snug">
              Every reading, tracked the moment it changes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { Icon: IconFlask, label: 'pH', value: '6.2' },
              { Icon: IconDroplet, label: 'TDS', value: '720 ppm' },
              { Icon: IconThermo, label: 'Temp', value: '24°C' },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="rounded-xl2 bg-white/10 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-lime-400" />
                <p className="mt-3 text-lg font-semibold">{value}</p>
                <p className="text-xs text-moss-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
