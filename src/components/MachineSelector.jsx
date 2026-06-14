import { useLang } from '../context/LanguageContext'
import { machines } from '../data/machines'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function MachineSelector({ selected, onSelect }) {
  const { lang, t } = useLang()

  return (
    <section id="machines" className="relative scroll-mt-16 border-t border-cruci-iron/60 py-20 sm:py-28">
      <div className="absolute inset-0 blueprint opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker={t.machines.kicker} title={t.machines.title} subtitle={t.machines.subtitle} />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {machines.map((m, i) => {
            const isSelected = selected === m.id
            const number = m.name.replace(/plantor/i, '').trim() // "3.9"
            return (
              <Reveal key={m.id} delay={i * 110}>
                <button
                  type="button"
                  onClick={() => onSelect(m.id)}
                  className={`group relative w-full overflow-hidden rounded-2xl border bg-cruci-steel text-left transition-all duration-300 ${
                    isSelected
                      ? 'corner-ticks border-cruci-red shadow-[0_0_0_1px_rgba(227,6,19,0.5),0_30px_80px_-30px_rgba(227,6,19,0.55)]'
                      : 'border-cruci-iron hover:-translate-y-1 hover:border-cruci-red/50 hover:shadow-2xl'
                  }`}
                >
                  {/* Imagen */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-cruci-ink">
                    <img
                      src={m.image}
                      alt={`${m.name} ${m.edition}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cruci-steel via-cruci-steel/10 to-transparent" />

                    <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                      {m.edition}
                    </span>

                    {isSelected && (
                      <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cruci-red text-white shadow-lg">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Cuerpo */}
                  <div className="p-6 sm:p-7">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-cruci-ash">Plantor</p>
                    <div className="mt-1 flex items-baseline gap-3">
                      <h3 className="font-display leading-none text-cruci-paper text-[clamp(2.75rem,9vw,4rem)]">
                        <span className="text-grad-red">{number}</span>
                      </h3>
                      <span className="font-mono text-xs uppercase tracking-[0.25em] text-cruci-red">{m.edition}</span>
                    </div>

                    <p className="mt-3 text-sm text-cruci-paper/60">{m.tagline[lang]}</p>

                    {/* Specs con líder punteado */}
                    <dl className="mt-6 space-y-2.5">
                      {m.specs.map((s, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <dt className="font-mono text-[11px] uppercase tracking-wide text-cruci-ash">{s[lang]}</dt>
                          <span className="leader" />
                          <dd className="font-semibold text-cruci-paper">{s.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div
                      className={`mt-7 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider transition ${
                        isSelected
                          ? 'bg-cruci-red text-white'
                          : 'border border-cruci-iron bg-cruci-coal text-cruci-paper group-hover:border-cruci-red group-hover:bg-cruci-red group-hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {t.machines.selected}
                        </>
                      ) : (
                        t.machines.select
                      )}
                    </div>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
