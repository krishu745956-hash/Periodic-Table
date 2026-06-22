import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import ElementCard from '../components/ElementCard'
import CategoryLegend from '../components/CategoryLegend'
import { getGridPosition, getCategoryColor, getBlock } from '../utils/elementUtils'

const BLOCK_FILTERS = ['s', 'p', 'd', 'f']
const CATEGORIES = [
  'alkali metal', 'alkaline earth metal', 'transition metal', 'post-transition metal',
  'metalloid', 'polyatomic nonmetal', 'diatomic nonmetal', 'noble gas', 'lanthanide', 'actinide',
  'Synthetic / Unknown'
]

// Deterministic "random" opacity for skeleton cells — stable across renders
const skeletonOpacities = Array.from({ length: 180 }, (_, i) => 0.15 + ((i * 7 + i * i * 3) % 25) / 100)

function LoadingSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="text-center mb-8">
        <div className="h-10 w-72 skeleton-shimmer rounded mx-auto mb-2" style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }} />
        <div className="h-5 w-56 skeleton-shimmer rounded mx-auto" style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }} />
      </div>
      <div className="min-w-[600px]">
        <div className="grid grid-cols-18 gap-[4px] auto-rows-[58px] md:auto-rows-[58px]">
          {Array.from({ length: 180 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border-2 border-dashed border-ink-faint skeleton-shimmer"
              style={{
                borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px',
                opacity: skeletonOpacities[i],
                animationDelay: `${(i * 15) % 2000}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState({ error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <svg className="w-16 h-16 text-marker-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 className="font-display text-xl font-bold text-ink mb-2">Failed to Load Elements</h2>
      <p className="font-body text-ink-muted mb-6 max-w-md">
        Could not fetch the periodic table data. Please check your internet connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="font-body px-6 py-3 bg-white border-2 border-ink shadow-sketch-sm hover:shadow-sketch text-ink font-medium transition-all wobbly-sm"
      >
        Retry
      </button>
    </div>
  )
}

export default function Home({ elements, loading, error }) {
  const [activeCategories, setActiveCategories] = useState(new Set())
  const [activeBlock, setActiveBlock] = useState(null)

  const toggleCategory = useCallback((cat) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const { gridElements, lanthanides, actinides } = useMemo(() => {
    if (!elements.length) return { gridElements: [], lanthanides: [], actinides: [] }
    const main = [], lant = [], act = []
    elements.forEach(el => {
      let visible = true
      if (activeCategories.size > 0) {
        const syntheticNumbers = new Set([109, 110, 111, 113, 115, 116, 117, 118, 119])
        const matchesCategory = activeCategories.has(el.category) ||
          (activeCategories.has('Synthetic / Unknown') && syntheticNumbers.has(el.number))
        if (!matchesCategory) visible = false
      }
      if (activeBlock && getBlock(el) !== activeBlock) visible = false
      const elWithFilter = { ...el, _filtered: !visible }
      if (el.number >= 57 && el.number <= 71) lant.push(elWithFilter)
      else if (el.number >= 89 && el.number <= 103) act.push(elWithFilter)
      else main.push(elWithFilter)
    })
    return { gridElements: main, lanthanides: lant, actinides: act }
  }, [elements, activeCategories, activeBlock])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return <ErrorState error={error} />
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
    gridTemplateRows: 'repeat(10, auto)',
    gap: '4px'
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-2 md:px-4 py-6"
      initial={{ opacity: 0, rotate: -0.5, y: 10 }}
      animate={{ opacity: 1, rotate: 0, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="text-center mb-6 relative">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink">
          Periodic Table of Elements
        </h1>
        {/* Wavy underline SVG */}
        <div className="flex justify-center mt-1">
          <svg width="340" height="14" viewBox="0 0 340 14" className="overflow-visible">
            <path
              d="M10,7 Q50,0 90,7 Q130,14 170,7 Q210,0 250,7 Q290,14 330,7"
              stroke="#00c8e8"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="360"
              style={{ animation: 'scribble-in 1.2s ease forwards' }}
            />
          </svg>
        </div>
        <p className="font-body text-ink-muted mt-2" style={{ rotate: '-0.5deg' }}>
          118 elements · Click any element to explore
        </p>
      </div>

      {/* Category Legend */}
      <div className="mb-6 overflow-x-auto pb-2">
        <CategoryLegend activeCategories={activeCategories} onCategoryClick={toggleCategory} />
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <span className="font-body text-xs text-ink-muted uppercase tracking-wider self-center mr-1" style={{ fontFamily: 'Special Elite, cursive' }}>
          Category:
        </span>
        {CATEGORIES.map(cat => {
          const isActive = activeCategories.has(cat)
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="font-body text-xs px-2.5 py-1 border-2 border-ink transition-all duration-200
                         hover:scale-105 active:scale-95"
              style={{
                color: isActive ? '#fdfbf7' : getCategoryColor(cat),
                backgroundColor: isActive ? getCategoryColor(cat) : getCategoryColor(cat) + '11',
                borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
                boxShadow: isActive ? '4px 4px 0px 0px #2d2d2d' : '2px 2px 0px 0px #2d2d2d'
              }}
            >
              {cat}
            </button>
          )
        })}
        {activeCategories.size > 0 && (
          <button
            onClick={() => setActiveCategories(new Set())}
            className="font-body text-xs px-2.5 py-1 border-2 border-ink-faint text-ink-muted hover:text-ink transition-colors hover:scale-105 active:scale-95"
            style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Block Filter */}
      <div className="mb-6 flex gap-2 justify-center items-center">
        <span className="font-mono text-xs text-ink-muted uppercase tracking-wider mr-1">Block:</span>
        {BLOCK_FILTERS.map(block => {
          const isActive = activeBlock === block
          return (
            <button
              key={block}
              onClick={() => setActiveBlock(isActive ? null : block)}
              className="w-8 h-8 font-display font-bold text-sm border-3 border-ink transition-all duration-200
                         hover:scale-110 hover:rotate-[-3deg] active:scale-90"
              style={{
                borderWidth: '3px',
                borderColor: '#2d2d2d',
                borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px',
                backgroundColor: isActive ? '#2d2d2d' : '#fdfbf7',
                color: isActive ? '#fdfbf7' : '#7a7060',
                boxShadow: isActive ? 'none' : '2px 2px 0px 0px #2d2d2d'
              }}
            >
              {block.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* Periodic Table Grid */}
      <div className="relative w-full overflow-x-auto pb-4">
        {/* Corner annotation */}
        <div className="relative">
          <span
            className="absolute top-0 right-2 font-display text-xs text-ink-muted pointer-events-none z-20"
            style={{ rotate: '-3deg', transform: 'translateY(-22px)' }}
          >
            118 elements
          </span>
        </div>

        <div className="min-w-[590px]">
          <div style={gridStyle}>
            {(() => {
              const cells = []
              const placed = new Set()
              gridElements.forEach(el => {
                const pos = getGridPosition(el)
                const key = `${pos.row}-${pos.col}`
                if (!placed.has(key)) {
                  cells.push(
                    <div key={key} style={{ gridColumn: pos.col, gridRow: pos.row }}>
                      <ElementCard element={el} isFiltered={el._filtered} />
                    </div>
                  )
                  placed.add(key)
                }
              })
              return cells
            })()}
          </div>
        </div>
      </div>

      {/* Lanthanides Row */}
      {lanthanides.length > 0 && (
        <div className="mt-6">
          <div
            className="inline-flex items-center gap-2 mb-2 px-3 py-1 border-2 border-dashed border-ink-faint bg-post-it"
            style={{
              borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px',
              rotate: '0.5deg'
            }}
          >
            <span className="font-display text-sm text-ink">57–71 Lanthanides</span>
          </div>
          <div className="w-full overflow-visible">
            <div className="flex gap-[4px] pb-8" style={{ minWidth: lanthanides.length * 62 }}>
              {lanthanides.map(el => (
                <div key={el.number} className="relative overflow-visible" style={{ width: '58px' }}>
                  <ElementCard element={el} isFiltered={el._filtered} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actinides Row */}
      {actinides.length > 0 && (
        <div className="mt-3">
          <div
            className="inline-flex items-center gap-2 mb-2 px-3 py-1 border-2 border-dashed border-ink-faint bg-post-it"
            style={{
              borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px',
              rotate: '-0.3deg'
            }}
          >
            <span className="font-display text-sm text-ink">89–103 Actinides</span>
          </div>
          <div className="w-full overflow-visible">
            <div className="flex gap-[4px] pb-8" style={{ minWidth: actinides.length * 62 }}>
              {actinides.map(el => (
                <div key={el.number} className="relative overflow-visible" style={{ width: '58px' }}>
                  <ElementCard element={el} isFiltered={el._filtered} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
