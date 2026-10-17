// Safe ranges for each sensor. A value outside "warn" is a Warning;
// a value outside "crit" is Critical. (Keep in sync with client/src/data/sensorMeta.js)
export const LIMITS = {
  ph: { warn: [5.5, 6.5], crit: [5.0, 7.0] },
  tds: { warn: [600, 900], crit: [450, 1100] },
  temperature: { warn: [20, 26], crit: [18, 28] },
  waterLevel: { warn: [40, 100], crit: [25, 100] },
}

const SEVERITY_RANK = { Normal: 0, Warning: 1, Critical: 2 }

export function evaluateParam(key, value) {
  const { warn, crit } = LIMITS[key]
  if (value < crit[0] || value > crit[1]) return 'Critical'
  if (value < warn[0] || value > warn[1]) return 'Warning'
  return 'Normal'
}

// values = { ph, tds, temperature, waterLevel }
export function evaluate(values) {
  const statuses = {}
  let overall = 'Normal'
  for (const key of Object.keys(LIMITS)) {
    statuses[key] = evaluateParam(key, values[key])
    if (SEVERITY_RANK[statuses[key]] > SEVERITY_RANK[overall]) overall = statuses[key]
  }
  return { statuses, overall }
}

// Human-readable alert text for an out-of-range value.
export function describeViolation(key, value) {
  const { warn } = LIMITS[key]
  const high = value > warn[1]
  switch (key) {
    case 'ph':
      return {
        title: high ? 'High pH Level' : 'Low pH Level',
        description: `pH level is ${value}, ${high ? 'above' : 'below'} the recommended ${warn[0]}–${warn[1]} range.`,
      }
    case 'tds':
      return {
        title: high ? 'High Nutrient Concentration' : 'Low Nutrient Concentration',
        description: `Nutrient concentration is ${value} ppm, ${high ? 'above' : 'below'} the recommended ${warn[0]}–${warn[1]} ppm range.`,
      }
    case 'temperature':
      return {
        title: high ? 'High Water Temperature' : 'Low Water Temperature',
        description: `Water temperature is ${value}°C, ${high ? 'above' : 'below'} the recommended ${warn[0]}–${warn[1]}°C range.`,
      }
    default:
      return {
        title: 'Low Water Level',
        description: `Water level is ${value}%, below the recommended minimum of ${warn[0]}%.`,
      }
  }
}
