import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

// export default function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <html lang="en">
//         <body>
//             <Layout>
//                 <Component {...pageProps} />
//             </Layout>
//         </body>
//     </html>
//   )
// }

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout></body>
    </html>
  )
}