'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { Button } from './button'

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  const handleLanguageChange = (language: typeof languages[0]) => {
    setSelectedLanguage(language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{selectedLanguage?.flag || '🌐'}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg p-2 z-50"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-foreground">{language.name}</span>
                </div>
                {selectedLanguage?.code === language.code && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
