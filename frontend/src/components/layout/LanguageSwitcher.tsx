import React from 'react'
import { useI18n, Locale } from '@/i18n/I18nProvider'

const LanguageSwitcher: React.FC = () => {
	const { locale, setLocale } = useI18n()

	const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLocale(e.target.value as Locale)
	}

	return (
		<select
			value={locale}
			onChange={change}
			className="bg-transparent border border-gray-600 text-gray-200 rounded-md px-2 py-1 text-sm hover:border-gray-400"
			aria-label="Language selector"
		>
			<option value="pt">PT</option>
			<option value="en">EN</option>
			<option value="es">ES</option>
			<option value="zh">中文</option>
		</select>
	)
}

export default LanguageSwitcher
