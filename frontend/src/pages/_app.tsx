import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/layout/Layout'
import ToastProvider from '@/components/ui/ToastProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ToastProvider />
    </Layout>
  )
}
