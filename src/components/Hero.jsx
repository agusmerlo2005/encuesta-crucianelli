import { useLang } from '../context/LanguageContext'
import Reveal from './Reveal'

export default function Hero() {
  const { lang, t } = useLang()

  const stats =
    lang === 'pt'
      ? [
          ['02', 'Modelos Plantor'],
          ['08', 'Regiões atendidas'],
          ['BR', 'Grãos grossos'],
        ]
      : [
          ['02', 'Modelos Plantor'],
          ['08', 'Regiones'],
          ['BR', 'Granos gruesos'],
        ]

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
      {/* Capas de fondo */}
      <div className="absolute inset-0 blueprint opacity-60" />
      <div className="absolute inset-x-0 top-0 h-2/3 glow-red" />

      {/* Imagen de la máquina */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
        <img
          src="/assets/plantor3.9.png"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center opacity-60 lg:opacity-90"
        />
        {/* Máscaras para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-cruci-ink via-cruci-ink/85 to-cruci-ink/10 lg:via-cruci-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-cruci-ink via-transparent to-cruci-ink/40" />
      </div>

      {/* Texto fantasma gigante */}
      <span className="pointer-events-none absolute -bottom-4 left-0 select-none whitespace-nowrap font-display text-outline text-[26vw] leading-none sm:bottom-2">
        PLANTOR
      </span>

      {/* Franja roja diagonal */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-cruci-red sm:w-2" />

      {/* Contenido */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cruci-paper/60">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-cruci-red" />
              {t.hero.kicker}
              <span className="hidden text-cruci-ash sm:inline">// BR</span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <p className="mt-6 font-mono text-sm font-bold tracking-[0.2em] text-cruci-red">
              PLANTOR 3.9 · PLANTOR 3.2
            </p>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="mt-3 font-display uppercase leading-[0.92] tracking-tight text-cruci-paper text-[clamp(2.75rem,9vw,6.5rem)]">
              {t.hero.title}
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-6 max-w-xl text-base text-cruci-paper/65 sm:text-lg">{t.hero.subtitle}</p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#machines"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-cruci-red px-7 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_40px_-10px_rgba(227,6,19,0.7)] transition hover:bg-cruci-red-bright hover:shadow-[0_14px_50px_-8px_rgba(227,6,19,0.8)]"
              >
                {t.hero.cta}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <span className="font-mono text-xs uppercase tracking-wider text-cruci-ash">{t.hero.scroll}</span>
            </div>
          </Reveal>

          {/* Datos */}
          <Reveal delay={380}>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl border border-cruci-iron bg-cruci-iron">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-cruci-coal/90 px-4 py-4">
                  <dt className="font-display text-2xl text-cruci-paper sm:text-3xl">{value}</dt>
                  <dd className="mt-1 font-mono text-[10px] uppercase leading-tight tracking-wide text-cruci-ash">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
