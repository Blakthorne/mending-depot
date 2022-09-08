import Head from 'next/head'
import { SWRConfig } from 'swr'

function Home() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >

      <Head>
        <title>Mending Depot</title>
        <meta name="description" content="Helpful for the book mending business" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-gray-200 text-3xl text-center tracking-wide m-auto">
        I meet your book mending needs.
      </div>
    </SWRConfig>
  )
}

export default Home
