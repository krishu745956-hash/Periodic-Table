export function getCategoryColor(category) {
  const colors = {
    'diatomic nonmetal': '#06b6d4',
    'noble gas': '#ec4899',
    'alkali metal': '#ef4444',
    'alkaline earth metal': '#f97316',
    'metalloid': '#a855f7',
    'polyatomic nonmetal': '#14b8a6',
    'post-transition metal': '#22c55e',
    'transition metal': '#3b82f6',
    'lanthanide': '#eab308',
    'actinide': '#f59e0b',
    'Synthetic / Unknown': '#9ca3af'
  }
  return colors[category] || '#6b7280'
}

export function getGridPosition(element) {
  const { group, period, number } = element
  
  if (period === 6 && number >= 57 && number <= 71) {
    return { row: 9, col: number - 54 }
  }
  if (period === 7 && number >= 89 && number <= 103) {
    return { row: 10, col: number - 86 }
  }
  
  return {
    col: group || 1,
    row: period || 1
  }
}

export function formatMass(atomic_mass) {
  if (atomic_mass == null) return '—'
  const num = typeof atomic_mass === 'string' ? parseFloat(atomic_mass) : atomic_mass
  if (isNaN(num)) return '—'
  
  const str = num.toPrecision(4)
  return parseFloat(str).toString()
}

export function kelvinToCelsius(k) {
  if (k == null) return '—'
  const num = typeof k === 'string' ? parseFloat(k) : k
  if (isNaN(num)) return '—'
  return `${Math.round(num - 273.15)} °C`
}

export function getBlock(element) {
  const n = element.number
  if (n <= 2 || (n >= 3 && n <= 4) || (n >= 11 && n <= 12) ||
      (n >= 19 && n <= 20) || (n >= 37 && n <= 38) ||
      (n >= 55 && n <= 56) || (n >= 87 && n <= 88)) return 's'
  if ((n >= 5 && n <= 10) || (n >= 13 && n <= 18) || (n >= 31 && n <= 36) ||
      (n >= 49 && n <= 54) || (n >= 81 && n <= 86) || (n >= 113 && n <= 118)) return 'p'
  if ((n >= 21 && n <= 30) || (n >= 39 && n <= 48) || (n >= 72 && n <= 80) ||
      (n >= 104 && n <= 112)) return 'd'
  if ((n >= 57 && n <= 71) || (n >= 89 && n <= 103)) return 'f'
  return null
}

export function truncate(str, len = 20) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len - 1) + '…' : str
}