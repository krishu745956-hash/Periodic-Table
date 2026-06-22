import { useState, useEffect } from 'react'

export function useElements() {
  const [elements, setElements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('ptable')
    if (cached) {
      try {
        const data = JSON.parse(cached)
        setElements(data.elements)
        setLoading(false)
        return
      } catch (e) {
        // If parsing fails, fall through to fetch
      }
    }

    fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        // Normalize synthetic elements to "Synthetic / Unknown" category
        const syntheticNumbers = new Set([109, 110, 111, 113, 115, 116, 117, 118, 119])
        data.elements = data.elements.map(el => ({
          ...el,
          category: syntheticNumbers.has(el.number) ? 'Synthetic / Unknown' : el.category
        }))
        sessionStorage.setItem('ptable', JSON.stringify(data))
        setElements(data.elements)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [])

  return { elements, loading, error }
}