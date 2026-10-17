import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 flex-none rounded-full transition-colors ${on ? 'bg-moss-700' : 'bg-moss-200'}`}
      aria-pressed={on}
      aria-label={label}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const { updateUser } = useAuth()
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  // Load this user's saved settings from PostgreSQL.
  useEffect(() => {
    api
      .get('/settings')
      .then((d) => setForm(d.settings))
      .catch((e) => setMessage({ type: 'error', text: e.message }))
  }, [])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const toggleDark = () => {
    const next = !form.darkMode
    set('darkMode', next)
    updateUser({ darkMode: next }) // preview immediately; saved when you click Save Changes
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const d = await api.put('/settings', form)
      setForm(d.settings)
      updateUser({ name: d.settings.name, darkMode: d.settings.darkMode })
      setMessage({ type: 'ok', text: 'Changes saved.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (!form) {
    return (
      <DashboardLayout title="Settings">
        <p className="text-stem">{message.text || 'Loading settings…'}</p>
      </DashboardLayout>
    )
  }

  const notifications = [
    { key: 'notifyCritical', label: 'Critical alerts', desc: 'Notify immediately for critical readings.' },
    { key: 'notifyWarning', label: 'Warning alerts', desc: 'Notify when a reading drifts outside range.' },
    { key: 'dailySummary', label: 'Daily summary', desc: 'Send a daily recap of system status.' },
  ]

  return (
    <DashboardLayout title="Settings">
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* Profile */}
        <section className="card p-6">
          <h3 className="font-semibold text-ink">Profile information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" value={form.email} disabled className="field-input cursor-not-allowed bg-moss-50 text-stem" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="farm">Farm name</label>
              <input id="farm" value={form.farmName} onChange={(e) => set('farmName', e.target.value)} className="field-input" />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="card p-6">
          <h3 className="font-semibold text-ink">Notification settings</h3>
          <div className="mt-4 space-y-4">
            {notifications.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{item.label}</p>
                  <p className="text-xs text-stem/80">{item.desc}</p>
                </div>
                <Toggle on={form[item.key]} onClick={() => set(item.key, !form[item.key])} label={item.label} />
              </div>
            ))}
          </div>
        </section>

        {/* System preferences */}
        <section className="card p-6">
          <h3 className="font-semibold text-ink">System preferences</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="unit">Temperature unit</label>
              <select id="unit" className="field-input" value={form.tempUnit} onChange={(e) => set('tempUnit', e.target.value)}>
                <option>Celsius</option>
                <option>Fahrenheit</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="refresh">Refresh interval</label>
              <select id="refresh" className="field-input" value={form.refreshInterval} onChange={(e) => set('refreshInterval', e.target.value)}>
                <option>1 minute</option>
                <option>5 minutes</option>
                <option>15 minutes</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg bg-moss-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Dark mode</p>
              <p className="text-xs text-stem/80">Switch the dashboard to a darker color scheme.</p>
            </div>
            <Toggle on={form.darkMode} onClick={toggleDark} label="Dark mode" />
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {message.text && (
            <span className={`text-sm font-medium ${message.type === 'error' ? 'text-rose-600' : 'text-moss-700'}`}>
              {message.text}
            </span>
          )}
        </div>
      </form>
    </DashboardLayout>
  )
}
