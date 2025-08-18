import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/layout/Layout'
import ToastProvider from '@/components/ui/ToastProvider'
import { I18nProvider } from '@/i18n/I18nProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Layout>
        <Component {...pageProps} />
        <ToastProvider />
      </Layout>
    </I18nProvider>
  )
}
