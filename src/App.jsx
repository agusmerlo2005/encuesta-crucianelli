import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MachineSelector from './components/MachineSelector'
import RegionMap from './components/RegionMap'
import DemoForm from './components/DemoForm'
import Footer from './components/Footer'

// Textura de grano (ruido SVG) como overlay sutil para dar profundidad industrial.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

export default function App() {
  const [selectedMachine, setSelectedMachine] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleSelectRegion = (id) => {
    setSelectedRegion(id)
    setSelectedCity('')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cruci-ink">
      {/* Barra de progreso de scroll */}
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div
          className="h-full bg-cruci-red transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grano global */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55] opacity-[0.04] mix-blend-screen"
        style={{ backgroundImage: GRAIN }}
      />

      <Header />
      <main>
        <Hero />
        <MachineSelector selected={selectedMachine} onSelect={setSelectedMachine} />
        <RegionMap
          selectedRegion={selectedRegion}
          selectedCity={selectedCity}
          onSelectRegion={handleSelectRegion}
          onSelectCity={setSelectedCity}
        />
        <DemoForm
          selectedMachine={selectedMachine}
          selectedRegion={selectedRegion}
          selectedCity={selectedCity}
        />
      </main>
      <Footer />
    </div>
  )
}
