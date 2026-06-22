import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ elements }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const filtered = query
    ? elements.filter(el =>
        el.name.toLowerCase().includes(query.toLowerCase()) ||
        el.symbol.toLowerCase().includes(query.toLowerCase()) ||
        String(el.number).includes(query)
      ).slice(0, 8)
    : []

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (number) => {
    navigate(`/element/${number}`)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="search" className="sr-only">Search elements</label>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2" />
        </svg>
        <input
          ref={inputRef}
          id="search"
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, symbol, or number..."
          className="w-full md:w-80 pl-10 pr-4 py-2 bg-white border-2 border-ink shadow-sketch-sm text-ink placeholder-ink-muted font-body text-sm
                     focus:border-marker-blue focus:shadow-[2px_2px_0_0_#2d5da1] focus:outline-none transition-all wobbly-sm"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={open && filtered.length > 0}
        />
      </div>

      {open && filtered.length > 0 && (
        <ul id="search-results" role="listbox" className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-ink shadow-sketch overflow-hidden z-50 animate-fade-in">
          {filtered.map(el => (
            <li key={el.number} role="option">
              <button
                onClick={() => handleSelect(el.number)}
                className="w-full px-4 py-2.5 text-left hover:bg-post-it transition-colors flex items-center gap-3"
              >
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-ink-faint text-ink rounded shadow-sketch-sm">
                  {el.symbol}
                </span>
                <span className="font-body text-ink flex-1">{el.name}</span>
                <span className="text-xs font-mono text-ink-muted">#{el.number}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}