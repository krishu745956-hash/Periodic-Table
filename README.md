# Elementum

**Interactive periodic table of elements with a hand-drawn sketchbook aesthetic.**

Explore all 118 elements through a wobbly, ink-on-paper interface — complete with a 3D Bohr model atom viewer, category and block filtering, real-time search, and animated page transitions.

![screenshot](./screenshot.png)

---

## UI/UX Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| [React](https://react.dev) | 18.3.1 | Component framework |
| [React Router DOM](https://reactrouter.com) | 6.26.0 | Client-side routing (Home → ElementDetail → NotFound) |
| [Framer Motion](https://www.framer.com/motion) | 10.18.0 | Page transitions, entrance animations, staggered reveals |
| [Three.js](https://threejs.org) | 0.184.0 | 3D Bohr model atom viewer with orbiting electrons |
| [Tailwind CSS](https://tailwindcss.com) | 3.4.10 | Utility-first styling with custom sketchbook theme |
| [Vite](https://vitejs.dev) | 4.5.3 | Build tool and dev server |

### Fonts (Google Fonts)

| Font | Usage |
|------|-------|
| [Kalam](https://fonts.google.com/specimen/Kalam) | Display headlines (bold, hand-drawn) |
| [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand) | Body text (casual handwritten) |
| [Special Elite](https://fonts.google.com/specimen/Special+Elite) | Monospace / typewriter (atomic numbers, data) |

---

## Color Scheme

### UI Colors

Defined in `tailwind.config.js` as custom Tailwind tokens.

| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#fdfbf7` | Page background |
| `paper-dark` | `#f0ebe0` | Secondary background, scrollbar track |
| `ink` | `#2d2d2d` | Primary text, borders, sketch shadows |
| `ink-muted` | `#7a7060` | Secondary / muted text |
| `ink-faint` | `#c8bfaa` | Grid dot texture, faint borders |
| `marker-cyan` | `#00c8e8` | Decorative accents (wavy underline) |
| `marker-red` | `#ff4d4d` | Error states |
| `marker-blue` | `#2d5da1` | Links, focus-visible outline |
| `post-it` | `#fff9c4` | Sticky note background (lanthanide / actinide labels) |

### Element Category Colors

Defined in `src/utils/elementUtils.js` via `getCategoryColor()`. Each category maps to a distinct color used for the card dot, glow, legend pill, filter button, and atom viewer nucleus.

| Category | Hex | Visual |
|----------|-----|--------|
| Diatomic Nonmetal | `#06b6d4` | ![#06b6d4](https://placehold.co/12/06b6d4/06b6d4) Cyan |
| Noble Gas | `#ec4899` | ![#ec4899](https://placehold.co/12/ec4899/ec4899) Pink |
| Alkali Metal | `#ef4444` | ![#ef4444](https://placehold.co/12/ef4444/ef4444) Red |
| Alkaline Earth Metal | `#f97316` | ![#f97316](https://placehold.co/12/f97316/f97316) Orange |
| Metalloid | `#a855f7` | ![#a855f7](https://placehold.co/12/a855f7/a855f7) Purple |
| Polyatomic Nonmetal | `#14b8a6` | ![#14b8a6](https://placehold.co/12/14b8a6/14b8a6) Teal |
| Post-Transition Metal | `#22c55e` | ![#22c55e](https://placehold.co/12/22c55e/22c55e) Green |
| Transition Metal | `#3b82f6` | ![#3b82f6](https://placehold.co/12/3b82f6/3b82f6) Blue |
| Lanthanide | `#eab308` | ![#eab308](https://placehold.co/12/eab308/eab308) Yellow |
| Actinide | `#f59e0b` | ![#f59e0b](https://placehold.co/12/f59e0b/f59e0b) Amber |
| Synthetic / Unknown | `#9ca3af` | ![#9ca3af](https://placehold.co/12/9ca3af/9ca3af) Gray |

### Block Classification

Blocks are determined by atomic number ranges (not electron config parsing):

| Block | Atomic Numbers | Elements |
|-------|---------------|----------|
| s | 1–2, 3–4, 11–12, 19–20, 37–38, 55–56, 87–88 | Groups 1 & 2 + He |
| p | 5–10, 13–18, 31–36, 49–54, 81–86, 113–118 | Groups 13–18 |
| d | 21–30, 39–48, 72–80, 104–112 | Transition metals |
| f | 57–71, 89–103 | Lanthanides & Actinides |

---

## File Structure

```
periodic-table/
├── index.html                 # Entry HTML — Google Fonts, Three.js import map
├── package.json               # Dependencies, scripts, rollup override
├── vite.config.js             # Vite dev server & build config
├── tailwind.config.js         # Custom theme — colors, fonts, grid columns
├── postcss.config.js          # PostCSS plugins (Tailwind + Autoprefixer)
│
└── src/
    ├── main.jsx               # React DOM mount point
    ├── App.jsx                # Router setup, ElementsContext provider,
    │                          #   AnimatePresence page transitions,
    │                          #   scroll-to-top on route change
    ├── index.css              # Global styles, custom properties,
    │                          #   keyframe animations (shimmer, scribble,
    │                          #   pulse-glow, sketch-fade, slide-down),
    │                          #   wobbly border-radius utilities,
    │                          #   sketch shadow utilities,
    │                          #   scrollbar styling,
    │                          #   prefers-reduced-motion support
    │
    ├── components/
    │   ├── AtomViewer.jsx     # 3D Bohr model with Three.js — pivot-group
    │   │                      #   shell architecture, orbiting electrons on
    │   │                      #   tilted XY-plane paths, nucleus glow, trail lines
    │   ├── CategoryLegend.jsx # Category pill legend with color dots,
    │   │                      #   wobbly pill shapes, hand-placed rotations,
    │   │                      #   hover tooltip descriptions
    │   ├── ElementCard.jsx    # Card component — React.memo'd, category dot
    │   │                      #   with glow, hover scale & tilt, tooltip,
    │   │                      #   card-pulse entrance animation, filtered state
    │   ├── Navbar.jsx         # Top navigation — logo, SearchBar toggles,
    │   │                      #   mobile slide-down menu, body scroll lock
    │   ├── SearchBar.jsx      # Real-time search — arrow-key navigation,
    │   │                      #   Enter to select / navigate, Escape to close,
    │   │                      #   dropdown stagger animation
    │   └── StatBadge.jsx      # Reusable stat display badge
    │
    ├── pages/
    │   ├── Home.jsx           # Main periodic table — 18-column grid,
    │   │                      #   lanthanide/actinide overflow rows,
    │   │                      #   category & block filter buttons,
    │   │                      #   useMemo for filtered arrays,
    │   │                      #   shimmer skeleton loading state,
    │   │                      #   error state with retry button
    │   ├── ElementDetail.jsx  # Element detail page — symbol, data grid,
    │   │                      #   ionization energy chart, electron shell
    │   │                      #   display, spectral image with fallback,
    │   │                      #   AtomViewer, section stagger animations,
    │   │                      #   prev/next navigation
    │   └── NotFound.jsx       # 404 page
    │
    ├── hooks/
    │   └── useElements.js     # Custom hook — fetches Bowserinator JSON,
    │                           #   normalizes synthetic element categories,
    │                           #   caches in sessionStorage, returns
    │                           #   { elements, loading, error }
    │
    └── utils/
        └── elementUtils.js    # Pure utility functions:
                                #   - getCategoryColor() — category → hex
                                #   - getGridPosition() — element → grid coords
                                #   - getBlock() — atomic # → s/p/d/f/null
                                #   - formatMass() — atomic mass → string
                                #   - kelvinToCelsius() — K → °C
                                #   - truncate() — string truncation
```

---

## Behavior & Features

### Periodic Table Grid
- 18-column CSS grid layout matching the standard periodic table structure.
- Main body elements sit in the grid; lanthanides (57–71) and actinides (89–103) are rendered in separate overflow rows below.
- Each element card fills exactly one grid cell with the element's symbol, atomic number, name, and mass.

### Category Filtering
- 11 category pills in the legend (color + label + wobbly pill shape).
- Click a pill → all matching elements highlight, others ghost to 12% opacity.
- Clicking "Synthetic / Unknown" uses atomic number ranges (109–111, 113, 115–119) instead of string matching for accuracy.
- Category filter buttons are independently toggleable; a "Clear" button resets all.

### Block Filtering
- Four block buttons (s, p, d, f) filter by orbital block.
- Block is determined by atomic number ranges — not electron configuration regex — ensuring correct classification for all 119 elements.

### Search
- Real-time search across element name and symbol.
- Dropdown shows matching suggestions with arrow-key navigation (↑/↓), Enter to navigate to detail, Escape to dismiss.
- Highlights matching text in search results.

### Element Detail Page
- Click any element card to navigate to `/element/:number`.
- Shows element symbol (large, rotated), name, atomic number, category badge, phase badge.
- Summary card with sketch-style border and Wikipedia link.
- Data grid: atomic mass, period/group, electron config, electronegativity, melting/boiling points, density, discovery info.
- Ionization energy bar chart (first 5 values).
- Electron shell visual — concentric circles with shell occupancy.
- Spectral emission image with fallback text on error.
- 3D Atom Viewer with orbiting electrons on tilted paths.

### 3D Atom Viewer
- Powered by Three.js (v0.184.0).
- Nucleus rendered as a glowing sphere colored by element category.
- Electrons orbit on tilted XY-plane paths around the nucleus (pivot-group architecture per shell).
- Trail lines trace electron paths for a planet-like orbital effect.
- Nucleus glow pulses subtly.

### Page Transitions
- Framer Motion `AnimatePresence` wraps all routes.
- Each page fades in with a slight vertical slide (fadeUp).
- Element Detail sections stagger their entrance (50ms delays per section).
- Home page has a sketch-style entrance (opacity + subtle rotation).

### Responsive Design
- Horizontal scroll on narrow screens for the 18-column grid.
- Navbar collapses into a hamburger menu on mobile with slide-down animation.
- Body scroll is locked when the mobile menu is open.

### Loading & Error States
- **Loading:** Shimmer skeleton with deterministic opacity pattern (stable across renders). Elements fade in with `card-pulse` animation (single 3s glow pulse per card).
- **Error:** Friendly error message with retry button.
- **Not Found:** 404 page with link back to the table.
- All data is cached in `sessionStorage` across navigations.

### Accessibility
- Keyboard navigable cards (Enter/Space to select).
- `focus-visible` outline ring on all interactive elements.
- ARIA labels on cards (`"{name}, element {number}, {category}"`), legend (`"Element categories"`), and roles (`gridcell`, `listitem`).
- `prefers-reduced-motion: reduce` media query disables all animations.

### Performance
- `React.memo` on ElementCard prevents unnecessary re-renders.
- `useMemo` for filtered grid arrays in Home.
- `useCallback` for toggle handlers.
- `sessionStorage` caching for the 119-element JSON payload.
- `card-pulse` animation runs once (3s) per card — not infinite — reducing GPU load across 118+ simultaneous cards.

---

## Data Source

Element data is fetched from [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) — a comprehensive JSON dataset of all 118 confirmed elements plus the predicted element 119 (Ununennium).

Categories for synthetic elements (atomic numbers 109–111, 113, 115–119) are normalized to "Synthetic / Unknown" on load for consistent UI display.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Details

- **Platform:** Linux ARM64 (built on Termux)
- **Node:** v20.19.2
- **npm:** 9.2.0
- **Vite:** 4.5.3 with `@vitejs/plugin-react`
- **Rollup:** 3.29.4 (pinned via `overrides`)

ARM64-specific dependencies are included in `devDependencies`:
- `@esbuild/linux-arm64@0.18.20`
- `@rollup/rollup-linux-arm64-gnu`
