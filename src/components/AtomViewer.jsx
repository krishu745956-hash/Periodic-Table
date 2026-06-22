import { useRef, useEffect, useState } from 'react'
import { getCategoryColor } from '../utils/elementUtils'

const MAX_TRAIL = 12

// Orbit tilt configurations for 3D spherical distribution
const ORBIT_TILTS = [
  { rx: Math.PI / 2, ry: 0 },
  { rx: Math.PI / 3, ry: Math.PI / 4 },
  { rx: Math.PI / 6, ry: Math.PI / 2 },
  { rx: Math.PI / 4, ry: 3 * Math.PI / 4 },
  { rx: Math.PI / 2, ry: Math.PI / 3 },
  { rx: Math.PI / 5, ry: Math.PI / 6 },
  { rx: Math.PI / 3, ry: Math.PI / 2 }
]

function hexToThreeColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return { r, g, b }
}

export default function AtomViewer({ element }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const animFrameRef = useRef(null)
  const electronDataRef = useRef([])
  const nucleusRef = useRef(null)
  const protonDotsRef = useRef([])
  const targetRotRef = useRef({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const catColor = getCategoryColor(element.category)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initThree = async () => {
      try {
        const THREE = await import('three')

        if (!containerRef.current) return

        const container = containerRef.current
        const width = container.clientWidth || 400
        const height = 400

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
        renderer.setSize(width, height)
        renderer.setClearColor(0xfdfbf7, 1)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        // Scene
        const scene = new THREE.Scene()
        scene.rotation.x = 0.3
        scene.rotation.y = 0.5

        // Camera
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
        camera.position.z = 5.5

        // Lighting — warm paper-like
        const ambient = new THREE.AmbientLight(0xfdfbf7, 0.8)
        scene.add(ambient)

        const directional = new THREE.DirectionalLight(0xffffff, 0.6)
        directional.position.set(5, 5, 5)
        scene.add(directional)

        const catColorObj = hexToThreeColor(catColor)
        const catHexInt = parseInt(catColor.replace('#', ''), 16)

        const nucleusGlow = new THREE.PointLight(catHexInt, 2.0, 10)
        nucleusGlow.position.set(0, 0, 0)
        scene.add(nucleusGlow)

        const electronGlow = new THREE.PointLight(0x00c8e8, 0.8, 8)
        electronGlow.position.set(2, 1, 3)
        scene.add(electronGlow)

        // NUCLEUS
        const nucleusRadius = 0.3 + Math.log(element.number) * 0.035
        const nucleusGeo = new THREE.SphereGeometry(nucleusRadius, 32, 32)
        const nucleusMat = new THREE.MeshStandardMaterial({
          color: catHexInt,
          emissive: catHexInt,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.9
        })
        const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat)
        scene.add(nucleus)
        nucleusRef.current = nucleus

        // PROTON ORBITING DOTS — tiny spheres near nucleus
        const protonCount = Math.min(Math.max(Math.floor(element.number / 20), 3), 6)
        const protonDots = []
        for (let i = 0; i < protonCount; i++) {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: catHexInt,
              emissiveIntensity: 1.0,
              roughness: 0
            })
          )
          const angle = (i / protonCount) * Math.PI * 2
          dot.position.set(Math.cos(angle) * 0.12, 0, Math.sin(angle) * 0.12)
          scene.add(dot)
          protonDots.push({ mesh: dot, angle, speed: 2.0 })
        }
        protonDotsRef.current = protonDots

        // ELECTRON SHELLS
        const shells = element.shells || []
        const electronData = []

        // Pre-compute trail color gradient (fixed: newest = cyan, oldest = paper white)
        const paperR = 0.992, paperG = 0.984, paperB = 0.969
        const cyanR = 0, cyanG = 0.784, cyanB = 0.910
        const trailColors = new Float32Array(MAX_TRAIL * 3)
        for (let i = 0; i < MAX_TRAIL; i++) {
          const t = (i + 1) / MAX_TRAIL
          trailColors[i * 3] = paperR * (1 - t) + cyanR * t
          trailColors[i * 3 + 1] = paperG * (1 - t) + cyanG * t
          trailColors[i * 3 + 2] = paperB * (1 - t) + cyanB * t
        }

        const tempWorldPos = new THREE.Vector3()

        shells.forEach((shellCount, i) => {
          if (!shellCount) return
          const orbitRadius = 0.9 + i * 0.65
          const tilt = ORBIT_TILTS[i % ORBIT_TILTS.length]
          const speed = 1.2 / (i + 1)

          // Create a pivot group for this shell — handles both tilt axes
          const shellGroup = new THREE.Group()
          shellGroup.rotation.x = tilt.rx
          shellGroup.rotation.y = tilt.ry
          scene.add(shellGroup)

          // Orbit ring — drawn as pencil line using EllipseCurve, added to group
          const curve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0)
          const curvePoints = curve.getPoints(128)
          const orbitVertices = curvePoints.map(p => new THREE.Vector3(p.x, p.y, 0))
          const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitVertices)
          const orbitMat = new THREE.LineBasicMaterial({
            color: 0xc8bfaa,
            transparent: true,
            opacity: 0.5
          })
          const orbitLine = new THREE.Line(orbitGeo, orbitMat)
          // No separate rotation — group handles it
          shellGroup.add(orbitLine)

          // Electrons on this orbit
          for (let j = 0; j < shellCount; j++) {
            const angle = (j / shellCount) * Math.PI * 2

            // Electron sphere
            const electronMesh = new THREE.Mesh(
              new THREE.SphereGeometry(0.07, 16, 16),
              new THREE.MeshStandardMaterial({
                color: 0x00c8e8,
                emissive: 0x00c8e8,
                emissiveIntensity: 1.5,
                roughness: 0,
                metalness: 0
              })
            )

            // Position in XY plane to match orbit ring, group rotation handles tilt
            const ex = Math.cos(angle) * orbitRadius
            const ey = Math.sin(angle) * orbitRadius
            electronMesh.position.set(ex, ey, 0)
            shellGroup.add(electronMesh)

            // Get world-space position for trail initialization
            electronMesh.getWorldPosition(tempWorldPos)

            // Electron trail line (added to scene, not group — world space)
            const trailPositions = new Float32Array(MAX_TRAIL * 3)
            for (let k = 0; k < MAX_TRAIL; k++) {
              trailPositions[k * 3] = tempWorldPos.x
              trailPositions[k * 3 + 1] = tempWorldPos.y
              trailPositions[k * 3 + 2] = tempWorldPos.z
            }
            const trailGeo = new THREE.BufferGeometry()
            trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
            trailGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(trailColors), 3))
            trailGeo.setDrawRange(0, MAX_TRAIL)

            const trailMat = new THREE.LineBasicMaterial({
              vertexColors: true,
              transparent: true,
              opacity: 0.7,
              linewidth: 1
            })
            const trailLine = new THREE.Line(trailGeo, trailMat)
            scene.add(trailLine)

            electronData.push({
              mesh: electronMesh,
              trailLine,
              trailGeo,
              trailPositions,
              trailLength: MAX_TRAIL,
              orbitRadius,
              speed,
              angle
            })
          }
        })

        electronDataRef.current = electronData

        // MOUSE DRAG with smooth damping
        let isDragging = false
        let prevMouseX = 0
        let prevMouseY = 0
        const targetRot = targetRotRef.current

        const onMouseDown = (e) => {
          const rect = renderer.domElement.getBoundingClientRect()
          if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom) return
          isDragging = true
          prevMouseX = e.clientX
          prevMouseY = e.clientY
        }

        const onMouseMove = (e) => {
          if (!isDragging) return
          const dx = e.clientX - prevMouseX
          const dy = e.clientY - prevMouseY
          targetRot.y += dx * 0.01
          targetRot.x += dy * 0.01
          prevMouseX = e.clientX
          prevMouseY = e.clientY
        }

        const onMouseUp = () => { isDragging = false }

        const onTouchStart = (e) => {
          const touch = e.touches[0]
          if (!touch) return
          isDragging = true
          prevMouseX = touch.clientX
          prevMouseY = touch.clientY
        }

        const onTouchMove = (e) => {
          if (!isDragging) return
          const touch = e.touches[0]
          if (!touch) return
          const dx = touch.clientX - prevMouseX
          const dy = touch.clientY - prevMouseY
          targetRot.y += dx * 0.01
          targetRot.x += dy * 0.01
          prevMouseX = touch.clientX
          prevMouseY = touch.clientY
        }

        const onTouchEnd = () => { isDragging = false }

        renderer.domElement.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        window.addEventListener('touchend', onTouchEnd)

        // RESIZE
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const w = entry.contentBoxSize?.[0]?.inlineSize || entry.contentRect.width || 400
            const h = 400
            renderer?.setSize(w, h)
            camera?.aspect(w / h)
            camera?.updateProjectionMatrix()
          }
        })
        resizeObserver.observe(container)

        // ANIMATION LOOP
        const clock = new THREE.Clock()

        const animate = () => {
          animFrameRef.current = requestAnimationFrame(animate)

          const delta = Math.min(clock.getDelta(), 0.05)
          const elapsedTime = clock.getElapsedTime()

          // Smooth damping rotation
          scene.rotation.y += (targetRot.y - scene.rotation.y) * 0.08
          scene.rotation.x += (targetRot.x - scene.rotation.x) * 0.08

          // Nucleus pulse
          if (nucleusRef.current) {
            const pulse = 1 + Math.sin(elapsedTime * 4) * 0.04
            nucleusRef.current.scale.set(pulse, pulse, pulse)
            nucleusRef.current.rotation.y += 0.005
          }

          // Proton dots orbit
          for (const dot of protonDotsRef.current) {
            dot.angle += dot.speed * delta
            dot.mesh.position.x = Math.cos(dot.angle) * 0.12
            dot.mesh.position.z = Math.sin(dot.angle) * 0.12
          }

          // Move electrons and update trails
          for (const data of electronData) {
            data.angle += data.speed * delta

            // Update position in XY plane (same as orbit ring, group handles tilt rotation)
            const ex = Math.cos(data.angle) * data.orbitRadius
            const ey = Math.sin(data.angle) * data.orbitRadius
            data.mesh.position.set(ex, ey, 0)

            // Get world-space position for trail
            data.mesh.getWorldPosition(tempWorldPos)

            // Shift trail positions: move all toward index 0, newest at end
            const pos = data.trailPositions
            for (let k = 0; k < (MAX_TRAIL - 1) * 3; k++) {
              pos[k] = pos[k + 3]
            }
            // Set newest position at last slot
            pos[(MAX_TRAIL - 1) * 3] = tempWorldPos.x
            pos[(MAX_TRAIL - 1) * 3 + 1] = tempWorldPos.y
            pos[(MAX_TRAIL - 1) * 3 + 2] = tempWorldPos.z

            data.trailGeo.attributes.position.needsUpdate = true
          }

          renderer.render(scene, camera)
        }

        animFrameRef.current = requestAnimationFrame(animate)
        setLoaded(true)

        // CLEANUP
        return () => {
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current)
          }
          renderer.domElement.removeEventListener('mousedown', onMouseDown)
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('mouseup', onMouseUp)
          renderer.domElement.removeEventListener('touchstart', onTouchStart)
          window.removeEventListener('touchmove', onTouchMove)
          window.removeEventListener('touchend', onTouchEnd)
          resizeObserver.disconnect()

          scene.traverse((obj) => {
            if (obj.isMesh || obj.isLine) {
              obj.geometry?.dispose()
              if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose())
              } else {
                obj.material?.dispose()
              }
            }
          })
          renderer.dispose()
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement)
          }
        }
      } catch (e) {
        console.error('AtomViewer: Three.js init failed', e)
        setError(e.message || 'Failed to load 3D viewer')
      }
    }

    const cleanup = initThree()

    return () => {
      cleanup.then(fn => fn && fn())
    }
  }, [element.number, element.category, catColor])

  // Shells display
  const shells = element.shells || []

  return (
    <div className="w-full">
      {/* Bohr Model label with arrow */}
      <div className="flex items-center justify-center mb-2 gap-2" style={{ rotate: '-1deg' }}>
        <span className="font-display text-sm text-ink-muted">Bohr Model</span>
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="#7a7060" strokeWidth="1.5">
          <path d="M10 0v12M4 6l6 6 6-6" />
        </svg>
      </div>

      <div
        ref={containerRef}
        className="w-full bg-white border-2 border-ink wobbly-md shadow-sketch-lg overflow-hidden"
        style={{ minHeight: '400px', padding: '0.5rem' }}
        role="img"
        aria-label={`3D Bohr model of ${element.name} with ${(element.shells || []).reduce((a, b) => a + b, 0)} electrons across ${(element.shells || []).length} shells`}
      >
        {error && (
          <div className="flex items-center justify-center h-[400px] text-ink-muted font-mono text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Tape decoration */}
      <div
        className="relative mx-auto -mt-4 pointer-events-none"
        style={{ width: 60, height: 16 }}
      >
        <div
          style={{
            width: 60,
            height: 16,
            background: 'rgba(200,191,170,0.6)',
            borderRadius: 2,
            rotate: '-1deg'
          }}
        />
      </div>

      {/* Shells info below viewer */}
      <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
        {shells.length > 0 && (
          <>
            <span className="font-display text-sm text-ink">Shells:</span>
            {shells.map((count, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 font-display text-sm font-bold"
                  style={{
                    borderRadius: '8px 30px 8px 30px / 30px 8px 30px 8px',
                    border: `2px solid ${catColor}`,
                    backgroundColor: '#fdfbf7',
                    color: catColor,
                    boxShadow: `0 0 6px ${catColor}44`
                  }}
                >
                  {count}
                </span>
                {i < shells.length - 1 && (
                  <span className="text-ink-faint">·</span>
                )}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  )
}