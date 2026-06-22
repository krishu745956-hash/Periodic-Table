import { useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AtomViewer from '../components/AtomViewer'
import { getCategoryColor, formatMass, kelvinToCelsius } from '../utils/elementUtils'

function IonizationChart({ energies, color }) {
  if (!energies || energies.length === 0) return null
  const maxEnergy = Math.max(...energies.slice(0, 5))

  return (
    <div className="mt-6">
      <h3 className="font-mono text-xs text-ink-muted mb-3 uppercase tracking-wider font-semibold">
        Ionization Energies
      </h3>
      <div className="flex items-end gap-2 h-24">
        {energies.slice(0, 5).map((val, i) => {
          const height = maxEnergy > 0 ? (val / maxEnergy) * 100 : 0
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="font-mono text-[10px] text-ink-muted">{val}</span>
              <div
                className="w-full transition-all duration-300"
                style={{
                  height: `${height}%`,
                  backgroundColor: color + '99',
                  border: '1px solid #2d2d2d',
                  borderRadius: '2px',
                  minHeight: '4px',
                  background: `linear-gradient(to top, ${color}cc, ${color}44)`
                }}
              />
              <span className="font-mono text-[9px] text-ink-muted">{i + 1}</span>
            </div>
          )
        })}
      </div>
      <p className="font-mono text-[10px] text-ink-muted mt-1">First 5 ionization energies (kJ/mol)</p>
    </div>
  )
}

function ElectronShellsDisplay({ shells, color }) {
  if (!shells || shells.length === 0) return null
  const maxCount = Math.max(...shells)

  return (
    <div className="mt-6">
      <h3 className="font-mono text-xs text-ink-muted mb-3 uppercase tracking-wider font-semibold">
        Electron Shells
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        {shells.map((count, i) => {
          const size = 28 + (count / maxCount) * 36
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className="rounded-full flex items-center justify-center font-display text-sm font-bold"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: '#fdfbf7',
                  border: `2px solid ${color}`,
                  color: '#2d2d2d',
                  boxShadow: `0 0 6px ${color}44`
                }}
              >
                {count}
              </div>
              <span className="font-mono text-[10px] text-ink-muted mt-0.5">{i + 1}</span>
            </div>
          )
        })}
      </div>
      {shells.length > 1 && (
        <div className="flex items-center gap-1 mt-2 ml-1">
          {shells.map((_, i) => (
            <span key={i} className="text-ink-faint text-xs">
              {i > 0 && <span className="mx-0.5">- -</span>}
              ●
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Section wrapper with staggered entrance animation
function Section({ delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay }
})

export default function ElementDetail({ elements, loading, error }) {
  const { number } = useParams()
  const navigate = useNavigate()
  const element = elements.find(el => el.number === parseInt(number))
  const catColor = element ? getCategoryColor(element.category) : '#6b7280'

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-6 w-24 skeleton-shimmer rounded" style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }} />
          <div className="h-16 w-32 skeleton-shimmer rounded" style={{ borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px' }} />
          <div className="h-8 w-64 skeleton-shimmer rounded" style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }} />
          <div className="h-4 w-96 skeleton-shimmer rounded" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 skeleton-shimmer rounded" style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="font-body text-marker-red">Failed to load element data.</p>
        <button onClick={() => navigate('/')} className="mt-4 font-body text-marker-blue hover:underline">
          ← Back to table
        </button>
      </div>
    )
  }

  if (!element) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink mb-2">Element not found</h2>
        <p className="font-body text-ink-muted mb-4">No element with atomic number {number} exists.</p>
        <button onClick={() => navigate('/')} className="font-body text-marker-blue hover:underline">
          ← Back to periodic table
        </button>
      </div>
    )
  }

  const prevElement = elements.find(el => el.number === element.number - 1)
  const nextElement = elements.find(el => el.number === element.number + 1)

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-6"
      {...fadeUp(0)}
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 font-body text-sm text-ink bg-white border-2 border-ink shadow-sketch-sm px-3 py-1.5 hover:bg-ink hover:text-white transition-colors"
        style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }}
        aria-label="Go back"
        {...fadeUp(0.05)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </motion.button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* LEFT COLUMN */}
        <div>
          {/* "lab notes" label */}
          <div className="font-display text-xs text-ink-muted mb-1" style={{ rotate: '1deg' }}>
            ✏ lab notes
          </div>

          {/* Symbol + Name */}
          <Section delay={0.1}>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="font-display font-bold leading-none"
                style={{
                  color: catColor,
                  fontSize: '5rem',
                  rotate: '-2deg',
                  filter: `drop-shadow(0 0 8px ${catColor}66)`
                }}
              >
                {element.symbol}
              </span>
              <div>
                <h1 className="font-display font-bold text-4xl text-ink">
                  {element.name}
                </h1>
                <span className="font-mono text-sm text-ink-muted">Element {element.number}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className="font-display text-xs px-3 py-1 border-2 border-ink shadow-sketch-sm"
                style={{
                  backgroundColor: catColor,
                  color: '#fdfbf7',
                  borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px'
                }}
              >
                {element.category}
              </span>
              {element.phase && (
                <span
                  className="font-body text-xs px-3 py-1 border-2 border-ink bg-white text-ink"
                  style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
                >
                  {element.phase}
                </span>
              )}
            </div>
          </Section>

          {/* Summary card */}
          <Section delay={0.2}>
            <div className="relative mt-5 bg-white border-2 border-ink shadow-sketch p-5"
              style={{ borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px' }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-1deg)',
                  width: 60,
                  height: 16,
                  background: 'rgba(200,191,170,0.6)',
                  borderRadius: 2
                }}
              />
              {element.summary && (
                <p className="font-body text-lg text-ink leading-relaxed">
                  {element.summary}
                </p>
              )}
              {element.source && (
                <a
                  href={element.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-body text-sm text-marker-blue"
                  style={{ textDecoration: 'underline wavy #2d5da1' }}
                >
                  Learn more on Wikipedia ↗
                </a>
              )}
            </div>
          </Section>

          {/* Data Grid Card */}
          <Section delay={0.3}>
            <div
              className="mt-6 bg-white border-2 border-ink shadow-sketch p-5"
              style={{ borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px', rotate: '0.3deg' }}
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                  ['Atomic Number', element.number],
                  ['Atomic Mass', `${formatMass(element.atomic_mass)} u`],
                  ['Period / Group', `${element.period} / ${element.group ?? '—'}`],
                  ['Electron Config', element.electron_configuration],
                  ['Electronegativity', element.electronegativity_pauling ?? '—'],
                  ['Melting Point', kelvinToCelsius(element.melt)],
                  ['Boiling Point', kelvinToCelsius(element.boil)],
                  ['Density', element.density != null ? `${element.density} g/cm³` : '—'],
                  ['Discovered by', element.discovered_by ?? '—'],
                  ['Year', element.year ?? '—']
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-dashed border-ink-faint pb-1.5 last:border-b-0">
                    <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">{label}</span>
                    <p className="font-body text-lg text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Ionization Energies */}
          <Section delay={0.4}>
            {element.ionization_energies && element.ionization_energies.length > 0 && (
              <IonizationChart energies={element.ionization_energies} color={catColor} />
            )}
          </Section>

          {/* Electron Shells Visual */}
          <Section delay={0.45}>
            {element.shells && element.shells.length > 0 && (
              <ElectronShellsDisplay shells={element.shells} color={catColor} />
            )}
          </Section>

          {/* Spectral Image */}
          <Section delay={0.5}>
            {element.spectral_img && (
              <div className="mt-6">
                <h3 className="font-mono text-xs text-ink-muted mb-2 uppercase tracking-wider font-semibold">
                  Spectral Emission Lines
                </h3>
                <div className="bg-white border-2 border-ink shadow-sketch-sm p-3"
                  style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }}
                >
                  <img
                    src={element.spectral_img}
                    alt={`Spectral emission lines of ${element.name}`}
                    className="w-full h-auto"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const parent = e.target.parentElement
                      const fallback = parent.querySelector('[data-spectral-fallback]')
                      if (fallback) fallback.style.display = 'block'
                    }}
                  />
                  <div
                    data-spectral-fallback
                    className="hidden font-body text-sm text-ink-muted text-center py-8"
                  >
                    Spectral image not available
                  </div>
                </div>
              </div>
            )}
          </Section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="mt-8 lg:mt-0">
          {/* AtomViewer */}
          <Section delay={0.15}>
            <AtomViewer element={element} />
          </Section>

          {/* Properties Card */}
          <Section delay={0.35}>
            <div
              className="mt-6 bg-white border-2 border-ink shadow-sketch p-5"
              style={{ borderRadius: '15px 255px 15px 225px / 225px 15px 255px 15px' }}
            >
              <h3 className="font-display text-sm text-ink mb-3 uppercase tracking-wider">
                Element Properties
              </h3>

              {element.electron_configuration_semantic && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-ink-faint last:border-b-0">
                  <span className="font-mono text-xs text-ink-muted">Config (compact)</span>
                  <span className="font-mono text-xs text-ink">{element.electron_configuration_semantic}</span>
                </div>
              )}

              {element.electron_affinity != null && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-ink-faint last:border-b-0">
                  <span className="font-mono text-xs text-ink-muted">Electron Affinity</span>
                  <span className="font-mono text-xs text-ink">{element.electron_affinity} kJ/mol</span>
                </div>
              )}

              {element.named_by && (
                <div className="flex justify-between items-center py-2 border-b border-dashed border-ink-faint last:border-b-0">
                  <span className="font-mono text-xs text-ink-muted">Named by</span>
                  <span className="font-mono text-xs text-ink">{element.named_by}</span>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Prev / Next Navigation */}
      <motion.div className="mt-10 pt-6 border-t-2 border-dashed border-ink-faint flex justify-between"
        {...fadeUp(0.5)}
      >
        {prevElement ? (
          <Link
            to={`/element/${prevElement.number}`}
            className="inline-flex items-center gap-2 bg-white border-2 border-ink shadow-sketch-sm px-4 py-2 hover:shadow-sketch transition-all hover:scale-105 active:scale-95"
            style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <div className="text-right">
              <div className="font-mono text-xs text-ink-muted">{prevElement.number}</div>
              <div className="font-display font-bold text-sm text-ink">{prevElement.symbol} {prevElement.name}</div>
            </div>
          </Link>
        ) : <div />}

        {nextElement ? (
          <Link
            to={`/element/${nextElement.number}`}
            className="inline-flex items-center gap-2 bg-white border-2 border-ink shadow-sketch-sm px-4 py-2 hover:shadow-sketch transition-all hover:scale-105 active:scale-95 text-right"
            style={{ borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px' }}
          >
            <div>
              <div className="font-mono text-xs text-ink-muted">{nextElement.number}</div>
              <div className="font-display font-bold text-sm text-ink">{nextElement.symbol} {nextElement.name}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </motion.div>
    </motion.div>
  )
}
