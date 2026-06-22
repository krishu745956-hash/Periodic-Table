import { createContext, useContext, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useElements } from './hooks/useElements'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ElementDetail from './pages/ElementDetail'
import NotFound from './pages/NotFound'

const ElementsContext = createContext(null)

export function useElementsContext() {
  const ctx = useContext(ElementsContext)
  if (!ctx) throw new Error('useElementsContext must be used within ElementsProvider')
  return ctx
}

function ElementsProvider({ children }) {
  const { elements, loading, error } = useElements()
  return (
    <ElementsContext.Provider value={{ elements, loading, error }}>
      {children}
    </ElementsContext.Provider>
  )
}

function AppContent() {
  const { elements, loading, error } = useElementsContext()
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <>
      <Navbar elements={elements} />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<Home elements={elements} loading={loading} error={error} />}
            />
            <Route
              path="/element/:number"
              element={<ElementDetail elements={elements} loading={loading} error={error} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

export default function App() {
  return (
    <ElementsProvider>
      <div className="min-h-screen bg-paper">
        <AppContent />
      </div>
    </ElementsProvider>
  )
}
