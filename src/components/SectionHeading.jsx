export default function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-cruci-red" />
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cruci-red">{kicker}</p>
      </div>
      <h2 className="mt-4 font-display uppercase leading-[0.95] tracking-tight text-cruci-paper text-[clamp(2rem,5.5vw,3.5rem)]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 max-w-xl text-base text-cruci-paper/55">{subtitle}</p>}
    </div>
  )
}
