// Static sample numbers used ONLY on the public landing page preview card.
// (The real dashboard reads live data from PostgreSQL through the API.)
export const currentReadings = {
  ph: { label: 'pH Level', value: 6.2, unit: '', trend: [6.0, 6.1, 6.3, 6.2, 6.4, 6.2, 6.2] },
  tds: { label: 'TDS / Nutrient Level', value: 720, unit: 'ppm', trend: [690, 705, 715, 730, 710, 725, 720] },
  temp: { label: 'Water Temperature', value: 24, unit: '°C', trend: [23, 23.5, 24.2, 24.6, 24.1, 23.8, 24] },
  level: { label: 'Water Level', value: 82, unit: '%', trend: [88, 86, 85, 83, 84, 82, 82] },
}

export const systemStatus = {
  lastUpdated: 'Sample preview',
  cycleNote: 'Live readings every few seconds',
}
