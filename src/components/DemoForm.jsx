import { useState, useEffect, useMemo } from 'react'
import { useLang } from '../context/LanguageContext'
import { machines } from '../data/machines'
import { formSchema, allFieldKeys } from '../data/formSchema'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

// 👉 Pegá acá la URL del Web App de Apps Script cuando lo tengamos listo.
const SHEETS_WEB_APP_URL = ''

const buildEmpty = () => Object.fromEntries(allFieldKeys.map((k) => [k, '']))

export default function DemoForm({ selectedMachine, selectedRegion, selectedCity }) {
  const { lang, t } = useLang()
  const [form, setForm] = useState(buildEmpty)
  const [machine, setMachine] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    if (selectedMachine) setMachine(selectedMachine)
  }, [selectedMachine])

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const requiredKeys = useMemo(
    () => formSchema.flatMap((s) => s.fields.filter((f) => f.required).map((f) => f.key)),
    []
  )

  const validate = () => {
    const er = {}
    requiredKeys.forEach((k) => {
      if (!String(form[k] || '').trim()) er[k] = t.form.required
    })
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = t.form.invalidEmail
    if (!selectedCity) er.city = t.form.pickFromMap
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setStatus('submitting')

    const machineLabel = machines.find((m) => m.id === machine)
    const payload = {
      submittedAt: new Date().toISOString(),
      ...form,
      machine: machineLabel ? `${machineLabel.name} ${machineLabel.edition}` : '',
      region: selectedRegion || '',
      city: selectedCity || '',
      lang,
    }

    try {
      if (SHEETS_WEB_APP_URL) {
        await fetch(SHEETS_WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
      } else {
        console.log('[DEMO] Payload listo para enviar:', payload)
        await new Promise((r) => setTimeout(r, 700))
      }
      setStatus('success')
      setForm(buildEmpty())
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="form" className="scroll-mt-16 py-20 sm:py-28">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="corner-ticks relative rounded-2xl border border-cruci-red/40 bg-cruci-steel p-10 text-center shadow-[0_30px_80px_-30px_rgba(227,6,19,0.5)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cruci-red text-white">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-6 font-display uppercase text-cruci-paper text-3xl">{t.form.successTitle}</h3>
            <p className="mt-3 text-cruci-paper/60">{t.form.successMsg}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 rounded-full border border-cruci-iron bg-cruci-coal px-6 py-3 text-sm font-bold uppercase tracking-wide text-cruci-paper transition hover:border-cruci-red hover:bg-cruci-red hover:text-white"
            >
              {t.form.again}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const renderField = (field) => {
    const error = errors[field.key]
    const common = { value: form[field.key], onChange: update(field.key) }
    let control
    if (field.type === 'select') {
      control = (
        <select {...common} className={selectCls(error)}>
          <option value="">—</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o[lang]}
            </option>
          ))}
        </select>
      )
    } else if (field.type === 'textarea') {
      control = <textarea rows={3} {...common} className={inputCls(error) + ' resize-none'} />
    } else {
      const inputType = field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'
      control = <input type={inputType} {...common} className={inputCls(error)} />
    }
    return (
      <Field key={field.key} label={field.label[lang]} required={field.required} error={error}>
        {control}
      </Field>
    )
  }

  return (
    <section id="form" className="relative scroll-mt-16 border-t border-cruci-iron/60 py-20 sm:py-28">
      <div className="absolute inset-0 blueprint opacity-30" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading kicker={t.form.kicker} title={t.form.title} subtitle={t.form.subtitle} />
        </Reveal>

        <form onSubmit={handleSubmit} className="mt-12 space-y-5">
          {formSchema.map((section, idx) => (
            <Reveal key={section.id} delay={idx * 60}>
              <fieldset className="corner-ticks relative rounded-2xl border border-cruci-iron bg-cruci-steel p-5 sm:p-7">
                {/* Encabezado de sección */}
                <div className="mb-6 flex items-center gap-4 border-b border-cruci-iron pb-4">
                  <span className="font-display leading-none text-grad-red text-[clamp(2rem,7vw,2.75rem)]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cruci-ash">
                      {lang === 'pt' ? 'Seção' : 'Sección'} {idx + 1}/{formSchema.length}
                    </p>
                    <h3 className="font-display uppercase leading-tight text-cruci-paper text-xl">{section.title[lang]}</h3>
                    {section.note && <p className="text-xs text-cruci-paper/45">{section.note[lang]}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {section.fields.map(renderField)}

                  {section.id === 'contact' && (
                    <>
                      <Field label={t.form.machine}>
                        <select value={machine} onChange={(e) => setMachine(e.target.value)} className={selectCls()}>
                          <option value="">—</option>
                          {machines.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {m.edition}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label={t.form.region}>
                        <div className={readonlyCls}>
                          {selectedRegion || <span className="text-cruci-ash">{t.form.pickFromMap}</span>}
                        </div>
                      </Field>
                      <Field label={t.form.city} required error={errors.city}>
                        <div className={`${readonlyCls} ${errors.city ? 'border-cruci-red' : ''}`}>
                          {selectedCity || <span className="text-cruci-ash">{t.form.pickFromMap}</span>}
                        </div>
                      </Field>
                    </>
                  )}
                </div>
              </fieldset>
            </Reveal>
          ))}

          {status === 'error' && (
            <p className="rounded-xl border border-cruci-red/40 bg-cruci-red/10 px-4 py-3 text-sm font-medium text-cruci-red-bright">
              {t.form.errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-cruci-red px-6 py-4.5 text-base font-bold uppercase tracking-wider text-white shadow-[0_14px_50px_-12px_rgba(227,6,19,0.8)] transition hover:bg-cruci-red-bright disabled:opacity-60"
          >
            {status === 'submitting' ? t.form.submitting : t.form.submit}
            {status !== 'submitting' && (
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-cruci-paper/70">
        {label}
        {required && <span className="text-cruci-red"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-cruci-red-bright">{error}</span>}
    </label>
  )
}

const baseInput =
  'w-full rounded-xl border bg-cruci-coal px-4 py-3 text-sm text-cruci-paper placeholder:text-cruci-ash outline-none transition focus:border-cruci-red focus:ring-2 focus:ring-cruci-red/25'

const inputCls = (error) => `${baseInput} ${error ? 'border-cruci-red' : 'border-cruci-iron'}`

const selectCls = (error) => `${baseInput} select-chevron ${error ? 'border-cruci-red' : 'border-cruci-iron'}`

const readonlyCls = 'w-full rounded-xl border border-cruci-iron bg-cruci-coal px-4 py-3 text-sm font-semibold text-cruci-paper'
