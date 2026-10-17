import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Sparkline from '../components/Sparkline.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { currentReadings, systemStatus } from '../data/previewData.js'
import { IconActivity, IconFlask, IconBell, IconClock, IconLeaf, IconChevronRight } from '../components/icons.jsx'

const features = [
  {
    icon: IconActivity,
    title: 'Real-time monitoring',
    description: 'Watch pH, nutrient concentration, temperature, and water level update as conditions in the reservoir change.',
  },
  {
    icon: IconFlask,
    title: 'Sensor tracking',
    description: 'Every probe reports on its own card, so a drifting sensor is easy to spot before it affects the crop.',
  },
  {
    icon: IconBell,
    title: 'Smart alerts',
    description: 'Get flagged the moment a reading steps outside its safe range, with a clear severity level attached.',
  },
  {
    icon: IconClock,
    title: 'Historical data',
    description: 'Browse past readings in a simple table to see how the system has trended over recent days.',
  },
  {
    icon: IconLeaf,
    title: 'System health',
    description: 'A single status view shows whether the system is online and how the current nutrient cycle is progressing.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-moss-50 px-3 py-1 text-xs font-medium text-moss-700 ring-1 ring-inset ring-moss-200">
              Built for growers who watch the numbers
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Know exactly what your hydroponic system is doing, right now.
            </h1>
            <p className="mt-5 max-w-md text-base text-stem sm:text-lg">
              HydroPulse turns pH, TDS, temperature, and water-level readings into one calm dashboard — so small changes in the reservoir never go unnoticed.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary">
                Get Started
                <IconChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                Explore Dashboard
              </Link>
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="card relative p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Sample Hydro Farm</p>
                <p className="text-xs text-stem/70">{systemStatus.lastUpdated}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-50 px-2.5 py-1 text-xs font-medium text-moss-700 ring-1 ring-inset ring-moss-200">
                <span className="h-1.5 w-1.5 rounded-full bg-moss-500" />
                System Online
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {Object.values(currentReadings).map((r) => (
                <div key={r.label} className="rounded-lg border border-moss-100 p-3">
                  <p className="text-xs text-stem">{r.label}</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {r.value}
                    <span className="ml-1 text-xs font-normal text-stem">{r.unit}</span>
                  </p>
                  <div className="mt-1">
                    <Sparkline data={r.trend} height={28} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-moss-50 px-3 py-2.5">
              <p className="text-xs text-moss-800">Nutrient status</p>
              <StatusBadge status="Normal" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-moss-100 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-ink">Everything a reservoir needs watching over</h2>
            <p className="mt-3 text-stem">
              HydroPulse focuses on the handful of readings that actually decide plant health, and presents them clearly.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-stem">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-ink">Built around the reservoir, not the spreadsheet</h2>
            <p className="mt-4 text-stem">
              Most hydroponic setups already have sensors — the hard part is making sense of what they report. HydroPulse
              collects pH, TDS, temperature, and water-level readings into one dashboard, flags anything outside a safe
              range, and keeps a simple history so patterns are easy to see.
            </p>
            <p className="mt-4 text-stem">
              It's designed for a single grower checking in a few times a day, not a lab technician — clear numbers,
              clear status, nothing to configure before it's useful.
            </p>
          </div>

          <div className="card p-6">
            <p className="text-sm font-semibold text-ink">Current cycle</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stem">Update rate</span>
                <span className="font-medium text-ink">{systemStatus.cycleNote}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stem">Nutrient balance</span>
                <StatusBadge status="Normal" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stem">Last updated</span>
                <span className="font-medium text-ink">{systemStatus.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
