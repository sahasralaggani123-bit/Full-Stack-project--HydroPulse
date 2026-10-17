import { IconFlask, IconDroplet, IconThermo, IconWave } from '../components/icons.jsx'

// Display info for the four sensors. "field" is the key in each API reading.
// The ranges here match server/src/thresholds.js.
export const SENSORS = [
  { field: 'ph', label: 'pH Level', unit: '', range: '5.5 - 6.5', icon: IconFlask, color: '#307143' },
  { field: 'tds', label: 'TDS / Nutrient Level', unit: 'ppm', range: '600 - 900 ppm', icon: IconDroplet, color: '#65aa76' },
  { field: 'temperature', label: 'Water Temperature', unit: '°C', range: '20 - 26°C', icon: IconThermo, color: '#8fc233' },
  { field: 'waterLevel', label: 'Water Level', unit: '%', range: 'Above 40%', icon: IconWave, color: '#1c3b27' },
]
