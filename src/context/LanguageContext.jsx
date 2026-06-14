import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('pt')

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'pt' ? 'es' : 'pt'))
  }, [])

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de LanguageProvider')
  return ctx
}
