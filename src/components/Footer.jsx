import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="relative overflow-hidden border-t border-cruci-iron/60 bg-cruci-ink py-16">
      {/* Texto fantasma */}
      <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-outline text-[18vw] leading-none">
        CRUCIANELLI
      </span>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 text-center sm:px-6">
        <img src="/assets/crucianellilogo.png" alt="Crucianelli" className="h-8 w-auto" />
        <p className="max-w-md font-mono text-xs uppercase tracking-[0.2em] text-cruci-paper/60">
          {t.footer.tagline}
        </p>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cruci-ash">
          <span className="h-1.5 w-1.5 rounded-full bg-cruci-red" />
          © {new Date().getFullYear()} Crucianelli Brasil · {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
