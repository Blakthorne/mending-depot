import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { Metadata } from 'next'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html lang="en">
        <body>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </body>
    </html>
  )
}

export const metadata: Metadata = {
    title: 'Home',
    description: 'Welcome to the Mending Depot',
  }
