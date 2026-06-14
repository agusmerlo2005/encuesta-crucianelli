import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { id: 'machines', n: '01', label: t.nav.machines },
    { id: 'region', n: '02', label: t.nav.region },
    { id: 'form', n: '03', label: t.nav.form },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-cruci-iron/70 bg-cruci-ink/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3">
          <img src="/assets/crucianellilogo.png" alt="Crucianelli" className="h-6 w-auto sm:h-7" />
          <span className="hidden h-5 w-px bg-cruci-iron sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.35em] text-cruci-ash sm:block">
            Brasil
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group flex items-center gap-2 rounded-full px-3.5 py-2 transition hover:bg-cruci-iron/50"
            >
              <span className="font-mono text-[10px] text-cruci-red">{item.n}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-cruci-paper/70 transition group-hover:text-cruci-paper">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Idioma */}
        <div className="flex items-center rounded-full border border-cruci-iron bg-cruci-coal/80 p-0.5">
          {['pt', 'es'].map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide transition ${
                lang === code ? 'bg-cruci-red text-white' : 'text-cruci-ash hover:text-cruci-paper'
              }`}
              aria-pressed={lang === code}
            >
              {code === 'pt' ? 'PT' : 'ES'}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
