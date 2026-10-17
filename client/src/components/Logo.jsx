import { IconDroplet } from './icons.jsx'

export default function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-700 text-white">
        <IconDroplet className="h-5 w-5" />
      </span>
      <span className={`font-display text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
        HydroPulse
      </span>
    </div>
  )
}
