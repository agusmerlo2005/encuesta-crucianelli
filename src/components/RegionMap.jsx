import { useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { geoMercator } from 'd3-geo'
import { useLang } from '../context/LanguageContext'
import { regions, regionById, operatingStates } from '../data/regions'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

// Lienzo del mapa. La proyección se ajusta a las regiones (centro de Brasil) y los
// estados vecinos sangran por los bordes (se recortan), mostrando contornos reales.
const W = 800
const H = 600
const POINTS = {
  type: 'FeatureCollection',
  features: regions.map((r) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: r.coords } })),
}

export default function RegionMap({ selectedRegion, selectedCity, onSelectRegion, onSelectCity }) {
  const { lang, t } = useLang()
  const [hovered, setHovered] = useState(null)
  const [geo, setGeo] = useState(null)
  const activeRegion = regionById(selectedRegion)
  const cityWord = (n) => (lang === 'pt' ? (n === 1 ? 'cidade' : 'cidades') : n === 1 ? 'ciudad' : 'ciudades')

  useEffect(() => {
    let alive = true
    fetch('/brazil-states.geojson')
      .then((r) => r.json())
      .then((d) => alive && setGeo(d))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // Calculamos centro + escala ajustados a las regiones, y los pasamos a react-simple-maps
  // por la vía soportada (string + projectionConfig). Reconstruimos la MISMA proyección
  // para ubicar los pines, así contornos y pines quedan perfectamente alineados.
  const { projectionConfig, project } = useMemo(() => {
    const base = geoMercator().fitExtent([[150, 110], [W - 150, H - 120]], POINTS)
    const scale = base.scale()
    const center = base.invert([W / 2, H / 2])
    const proj = geoMercator().center(center).scale(scale).translate([W / 2, H / 2])
    return { projectionConfig: { center, scale }, project: proj }
  }, [])

  const pins = useMemo(
    () =>
      regions.map((r) => {
        const [x, y] = project(r.coords)
        return { ...r, px: (x / W) * 100, py: (y / H) * 100 }
      }),
    [project]
  )

  const activeState = activeRegion?.state

  return (
    <section id="region" className="relative scroll-mt-16 border-t border-cruci-iron/60 bg-cruci-coal/40 py-20 sm:py-28">
      <div className="absolute inset-0 blueprint-red opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker={t.region.kicker} title={t.region.title} subtitle={t.region.subtitle} />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Panel del mapa */}
          <Reveal>
            <div className="corner-ticks relative overflow-hidden rounded-2xl border border-cruci-iron bg-cruci-steel p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-cruci-ash">
                <span>// Mapa operacional · Brasil</span>
                <span className="text-cruci-red">
                  {regions.length} {lang === 'pt' ? 'regiões' : 'regiones'}
                </span>
              </div>

              {/* Lienzo del mapa */}
              <div className="relative overflow-hidden rounded-xl border border-cruci-iron/70 bg-cruci-ink blueprint">
                <div className="pointer-events-none absolute inset-0 glow-red opacity-40" />

                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={projectionConfig}
                  width={W}
                  height={H}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                >
                  {geo && (
                    <Geographies geography={geo}>
                      {({ geographies }) =>
                        geographies.map((g) => {
                          const sig = g.properties.sigla
                          const isOp = operatingStates.has(sig)
                          const isActive = sig === activeState
                          return (
                            <Geography
                              key={g.rsmKey}
                              geography={g}
                              tabIndex={-1}
                              style={{
                                default: {
                                  fill: isActive ? '#e30613' : isOp ? '#7a0f18' : '#23232c',
                                  stroke: '#000000',
                                  strokeWidth: isOp ? 1.4 : 1,
                                  strokeLinejoin: 'round',
                                  outline: 'none',
                                  pointerEvents: 'none',
                                  filter: isActive ? 'drop-shadow(0 0 7px rgba(227,6,19,0.65))' : 'none',
                                  transition: 'fill .25s ease',
                                },
                                hover: { outline: 'none', pointerEvents: 'none' },
                                pressed: { outline: 'none' },
                              }}
                            />
                          )
                        })
                      }
                    </Geographies>
                  )}
                </ComposableMap>

                {/* Pines de región (HTML → etiquetas siempre nítidas) */}
                <div className="absolute inset-0">
                  {pins.map((p) => {
                    const on = selectedRegion === p.id
                    const hot = hovered === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelectRegion(p.id)}
                        onMouseEnter={() => setHovered(p.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ left: `${p.px}%`, top: `${p.py}%` }}
                        className={`group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${
                          on || hot ? 'z-20' : 'z-10'
                        }`}
                      >
                        {/* Punto */}
                        <span className="relative flex h-3 w-3 items-center justify-center">
                          {on && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cruci-red opacity-75" />
                          )}
                          <span
                            className={`relative h-3 w-3 rounded-full border-2 transition ${
                              on
                                ? 'border-white bg-cruci-red'
                                : hot
                                  ? 'border-white bg-cruci-red-bright'
                                  : 'border-cruci-red-bright bg-cruci-ink'
                            }`}
                          />
                        </span>
                        {/* Etiqueta */}
                        <span
                          className={`mt-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide backdrop-blur-sm transition sm:text-[10px] ${
                            on
                              ? 'border-cruci-red bg-cruci-red text-white'
                              : 'border-cruci-iron bg-cruci-ink/85 text-cruci-paper group-hover:border-cruci-red-bright'
                          }`}
                        >
                          {p.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Estado de carga */}
                {!geo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cruci-ash">
                      {lang === 'pt' ? 'Carregando mapa…' : 'Cargando mapa…'}
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wide text-cruci-ash">
                {t.region.hint}
              </p>
            </div>
          </Reveal>

          {/* Panel de lectura */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-2xl border border-cruci-iron bg-cruci-steel p-6">
              {activeRegion ? (
                <>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cruci-ash">
                    <span className="h-1.5 w-1.5 rounded-full bg-cruci-red" />
                    {t.region.selectedRegion}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="rounded-md bg-cruci-red px-2 py-1 font-mono text-xs font-bold text-white">
                      {activeRegion.state}
                    </span>
                    <h3 className="font-display uppercase leading-none text-cruci-paper text-[clamp(1.75rem,5vw,2.5rem)]">
                      {activeRegion.name}
                    </h3>
                  </div>

                  <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-cruci-ash">
                    {t.region.pickCity}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeRegion.cities.map((city) => {
                      const onc = selectedCity === city
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => onSelectCity(city)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            onc
                              ? 'border-cruci-red bg-cruci-red text-white'
                              : 'border-cruci-iron text-cruci-paper/80 hover:border-cruci-red-bright hover:text-cruci-paper'
                          }`}
                        >
                          {city}
                        </button>
                      )
                    })}
                  </div>

                  {selectedCity && (
                    <div className="mt-auto pt-7">
                      <div className="rounded-xl border border-cruci-red/40 bg-cruci-red/10 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cruci-red-bright">
                          ✓ {t.region.selectedCity}
                        </p>
                        <p className="mt-1.5 font-display uppercase text-cruci-paper text-xl">
                          {selectedCity} · {activeRegion.name}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
                  <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border border-cruci-iron" />
                    <div className="absolute inset-3 rounded-full border border-cruci-iron" />
                    <div
                      className="absolute inset-0 animate-scan rounded-full"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(227,6,19,0.55) 360deg)',
                      }}
                    />
                    <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cruci-red" />
                  </div>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-cruci-ash">{t.region.none}</p>
                  <p className="mt-1 text-xs text-cruci-paper/40">{t.region.hint}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
