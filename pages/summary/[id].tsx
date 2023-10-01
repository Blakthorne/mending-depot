import Head from 'next/head'
import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import BookSummary from '../../components/BookSummary'

function Summary() {
    const router = useRouter()

    // Ensure router.query.id is seen as string instead of string[]
    const bookId = router.query.id as string

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
          <BookSummary bookId={ bookId }/>
        </div>
      </SWRConfig>
    )
  }
  
  export default Summary