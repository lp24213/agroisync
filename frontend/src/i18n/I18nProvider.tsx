import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './locales/en'
import pt from './locales/pt'
import es from './locales/es'
import zh from './locales/zh'

export type Locale = 'pt' | 'en' | 'es' | 'zh'

type Messages = Record<string, string>

interface I18nContextValue {
	locale: Locale
	setLocale: (l: Locale) => void
	t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const allMessages: Record<Locale, Messages> = { pt, en, es, zh }

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [locale, setLocaleState] = useState<Locale>('pt')

	useEffect(() => {
		const saved = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale | null) : null
		if (saved && allMessages[saved]) setLocaleState(saved)
	}, [])

	const setLocale = (l: Locale) => {
		setLocaleState(l)
		if (typeof window !== 'undefined') localStorage.setItem('locale', l)
	}

	const messages = useMemo(() => allMessages[locale] || pt, [locale])

	const t = (key: string) => messages[key] ?? key

	const value = useMemo(() => ({ locale, setLocale, t }), [locale, messages])

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextValue => {
	const ctx = useContext(I18nContext)
	if (!ctx) throw new Error('useI18n must be used within I18nProvider')
	return ctx
}
