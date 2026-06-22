import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategoryColor, formatMass, truncate } from '../utils/elementUtils'

const ElementCard = React.memo(function ElementCard({ element, isFiltered = false, isHighlighted = false }) {
  const navigate = useNavigate()
  const catColor = getCategoryColor(element.category)

  const handleClick = () => navigate(`/element/${element.number}`)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  if (isFiltered) {
    return (
      <div
        className="relative rounded-sm bg-white border-2 border-ink-faint/30"
        style={{ opacity: 0.12, borderStyle: 'dashed' }}
        role="gridcell"
        aria-label={`${element.name} (filtered)`}
      />
    )
  }

  return (
    <div
      className="group relative bg-white border-2 border-ink cursor-pointer card-pulse sketch-in wobbly-sm
                 transition-transform duration-200 ease-out z-10
                 hover:scale-[1.15] hover:z-50 hover:shadow-sketch hover:rotate-[-1.5deg]"
      style={{
        '--cat-color': catColor,
        animationDelay: `${(element.number * 8)}ms`
      }}
      role="gridcell"
      tabIndex={0}
      aria-label={`${element.name}, element ${element.number}, ${element.category}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Category color dot - top right */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: catColor,
          position: 'absolute',
          top: 3,
          right: 3,
          boxShadow: `0 0 4px 2px ${catColor}88`
        }}
      />

      {/* Top-left: atomic number */}
      <span className="absolute top-0.5 left-1 text-[8px] font-mono text-ink-muted leading-none select-none">
        {element.number}
      </span>

      {/* Center: symbol */}
      <div className="flex items-center justify-center h-full min-h-[36px]">
        <span className="text-[18px] font-display font-bold text-ink leading-none select-none">
          {element.symbol}
        </span>
      </div>

      {/* Bottom: name & mass */}
      <div className="absolute bottom-0.5 left-1 right-1 flex justify-between items-end gap-0.5">
        <span className="text-[7px] font-body text-ink-muted truncate leading-none">
          {truncate(element.name, 8)}
        </span>
        <span className="text-[6px] font-mono text-ink-muted leading-none whitespace-nowrap">
          {formatMass(element.atomic_mass)}
        </span>
      </div>

      {/* Tooltip on hover — CSS transition scales in */}
      <div className="absolute bottom-full left-1/2 mb-2 w-max max-w-[180px] z-[9999] tooltip-entrance">
        <div className="bg-white border-2 border-ink wobbly-sm shadow-sketch-sm px-3 py-2">
          <p className="font-display font-bold text-sm text-ink">{element.name}</p>
          <p className="font-body text-xs text-ink-muted mt-0.5">{element.category}</p>
          {element.phase && (
            <p className="font-body text-xs text-ink-muted mt-0.5 capitalize">{element.phase}</p>
          )}
        </div>
      </div>
    </div>
  )
})

export default ElementCard
