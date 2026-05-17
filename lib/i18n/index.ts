import { en } from './en'
import { fr } from './fr'

export type Locale = 'en' | 'fr'

export const locales: Record<Locale, typeof en> = { en, fr }

export const localeNames: Record<Locale, string> = {
  en: '🇬🇧 English',
  fr: '🇫🇷 Français',
}

let currentLocale: Locale = 'en'

export function setLocale(locale: Locale) {
  currentLocale = locale
  if (typeof window !== 'undefined') localStorage.setItem('apextek-locale', locale)
}

export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('apextek-locale') as Locale | null
    if (stored && stored in locales) return stored
  }
  return 'en'
}

export function t(key: string): string {
  const locale = getLocale()
  const translations = locales[locale] as Record<string, unknown>
  const parts = key.split('.')
  let val: unknown = translations
  for (const part of parts) {
    if (typeof val !== 'object' || val === null) return key
    val = (val as Record<string, unknown>)[part]
  }
  return typeof val === 'string' ? val : key
}
