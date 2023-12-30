'use client'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import BookSummary from './BookSummary'

function Summary({ params }: { params: { id: string } }) {
    return (
      <SWRConfig
        value = {{
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
        <Head>
          <title>Book Summary</title>
          <meta name="description" content="Book Summary" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <div className="mx-auto">
          <BookSummary bookId={ params.id }/>
        </div>
      </SWRConfig>
    )
  }
  
  export default Summary