import { getCategoryColor } from '../utils/elementUtils'

const categories = [
  'alkali metal',
  'alkaline earth metal',
  'transition metal',
  'post-transition metal',
  'metalloid',
  'polyatomic nonmetal',
  'diatomic nonmetal',
  'noble gas',
  'lanthanide',
  'actinide',
  'Synthetic / Unknown'
]

// Slight random rotations to make each pill look hand-placed
const pillRotations = [-1.5, 0.5, -0.5, 1, -1, 0.8, -0.8, 1.2, -1.2, 0.3, -0.7]

export default function CategoryLegend() {
  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start" role="list" aria-label="Element categories">
      {categories.map((cat, i) => (
        <span
          key={cat}
          role="listitem"
          title={cat === 'Synthetic / Unknown' ? 'Elements created artificially or with insufficient confirmed chemical properties for classification.' : undefined}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 font-body text-xs border-2 border-ink shadow-sketch-sm"
          style={{
            backgroundColor: getCategoryColor(cat) + '22',
            color: getCategoryColor(cat),
            borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
            rotate: `${pillRotations[i]}deg`
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getCategoryColor(cat) }}
            aria-hidden="true"
          />
          {cat === 'Synthetic / Unknown' ? 'Synthetic / Unknown' : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </span>
      ))}
    </div>
  )
}