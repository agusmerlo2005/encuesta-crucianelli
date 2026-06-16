import { useEffect, useMemo, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
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

// El GeoJSON viene con los anillos en sentido contrario al que espera d3-geo, por lo que
// interpretaba cada estado como "toda la esfera menos la región" (paths gigantes/invisibles).
// Invertimos los anillos para que dibuje el polígono correcto.
const reverseRings = (geom) => {
  if (geom.type === 'Polygon') return { ...geom, coordinates: geom.coordinates.map((r) => [...r].reverse()) }
  if (geom.type === 'MultiPolygon')
    return { ...geom, coordinates: geom.coordinates.map((poly) => poly.map((r) => [...r].reverse())) }
  return geom
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

  // Proyección ÚNICA ajustada a las regiones. La usamos para generar los paths de los
  // estados (geoPath) y para ubicar los pines, así contornos y pines comparten exactamente
  // la misma transformación.
  const projection = useMemo(
    () => geoMercator().fitExtent([[150, 110], [W - 150, H - 120]], POINTS),
    []
  )

  const pins = useMemo(
    () =>
      regions.map((r) => {
        const [x, y] = projection(r.coords)
        return { ...r, px: (x / W) * 100, py: (y / H) * 100 }
      }),
    [projection]
  )

  // Generamos los paths SVG nosotros mismos con geoPath + nuestra proyección.
  // (Evita que la librería del mapa reescale los contornos por su cuenta.)
  const shapes = useMemo(() => {
    if (!geo) return []
    const pathGen = geoPath(projection)
    return geo.features
      .map((f) => ({ sig: f.properties.sigla, d: pathGen({ ...f, geometry: reverseRings(f.geometry) }) }))
      .filter((s) => s.d)
  }, [geo, projection])

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

                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                >
                  {/* Fondo del lienzo en el MISMO gris que los estados no-operativos: así el
                      territorio fuera de Brasil (sin polígono) se funde en un gris uniforme. */}
                  <rect x={0} y={0} width={W} height={H} fill="#2c2c38" />
                  {shapes.map((s) => {
                    const isOp = operatingStates.has(s.sig)
                    const isActive = s.sig === activeState
                    // 3 niveles de contraste: resto de Brasil (gris) · operativos (rojo) · activo (rojo intenso)
                    const fill = isActive ? '#e30613' : isOp ? '#9a1420' : '#2c2c38'
                    const stroke = isActive ? '#ffd7da' : isOp ? '#e8434f' : '#52525f'
                    const strokeWidth = isActive ? 1.6 : isOp ? 1.2 : 0.7
                    return (
                      <path
                        key={s.sig}
                        d={s.d}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        style={{
                          pointerEvents: 'none',
                          transition: 'fill .25s ease, stroke .25s ease',
                          filter: isActive
                            ? 'drop-shadow(0 0 9px rgba(227,6,19,0.85))'
                            : isOp
                              ? 'drop-shadow(0 0 4px rgba(227,6,19,0.3))'
                              : 'none',
                        }}
                      />
                    )
                  })}
                </svg>

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

              {/* Leyenda: deja explícita la diferenciación de zonas */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-cruci-ash">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border border-[#e8434f] bg-[#9a1420]" />
                  {lang === 'pt' ? 'Onde atuamos' : 'Donde operamos'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border border-[#52525f] bg-[#2c2c38]" />
                  {lang === 'pt' ? 'Demais estados' : 'Resto de estados'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-cruci-red" />
                  {lang === 'pt' ? 'Região selecionada' : 'Región seleccionada'}
                </span>
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
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.25em] text-cruci-ash/70">
                    {t.region.citySuggestions}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
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

                  {/* Campo libre: el productor puede tipear cualquier ciudad */}
                  <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-cruci-ash">
                    {t.region.cityInputLabel}
                  </label>
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => onSelectCity(e.target.value)}
                    placeholder={t.region.cityPlaceholder}
                    className="mt-2 w-full rounded-xl border border-cruci-iron bg-cruci-ink px-4 py-3 text-sm text-cruci-paper placeholder:text-cruci-ash/50 transition focus:border-cruci-red focus:outline-none focus:ring-1 focus:ring-cruci-red"
                  />

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
