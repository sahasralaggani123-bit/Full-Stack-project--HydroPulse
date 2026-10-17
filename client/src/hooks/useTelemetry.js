import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { api } from '../api.js'

// Loads the latest N readings from PostgreSQL (via the API) and then keeps the
// list live by listening for new readings pushed over Socket.IO.
export default function useTelemetry(limit = 24) {
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let active = true

    api
      .get(`/telemetry/series?limit=${limit}`)
      .then((d) => active && setSeries(d.readings))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))

    const socket = io({ withCredentials: true })
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('telemetry', (reading) =>
      setSeries((prev) => (prev.some((r) => r.id === reading.id) ? prev : [...prev, reading].slice(-limit))),
    )

    return () => {
      active = false
      socket.disconnect()
    }
  }, [limit])

  return { series, latest: series[series.length - 1] || null, loading, error, connected }
}
