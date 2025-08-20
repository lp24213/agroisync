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
	loading: boolean
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const allMessages: Record<Locale, Messages> = { pt, en, es, zh }

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [locale, setLocaleState] = useState<Locale>('pt')
	const [translations, setTranslations] = useState<any>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const saved = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale | null) : null
		if (saved && allMessages[saved]) setLocaleState(saved)
	}, [])

	// Carregar traduções da API
	useEffect(() => {
		const fetchTranslations = async () => {
			try {
				setLoading(true)
				const response = await fetch(`/api/translations?locale=${locale}`)
				
				if (response.ok) {
					const data = await response.json()
					if (data.success && data.data) {
						setTranslations(data.data.translations)
					}
				}
			} catch (error) {
				console.error('Erro ao carregar traduções:', error)
				// Fallback para traduções locais
			} finally {
				setLoading(false)
			}
		}

		fetchTranslations()
	}, [locale])

	const setLocale = (l: Locale) => {
		setLocaleState(l)
		if (typeof window !== 'undefined') localStorage.setItem('locale', l)
	}

	const messages = useMemo(() => allMessages[locale] || pt, [locale])

	const t = (key: string) => {
		try {
			// Primeiro tentar usar traduções da API
			if (translations) {
				const keys = key.split('.')
				let value: any = translations
				
				for (const k of keys) {
					value = value?.[k]
				}
				
				if (value !== undefined) {
					return value
				}
			}
			
			// Fallback para traduções locais
			return messages[key] ?? key
		} catch (error) {
			console.warn(`Translation key not found: ${key}`)
			return key
		}
	}

	const value = useMemo(() => ({ locale, setLocale, t, loading }), [locale, messages, translations, loading])

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextValue => {
	const ctx = useContext(I18nContext)
	if (!ctx) throw new Error('useI18n must be used within I18nProvider')
	return ctx
}
