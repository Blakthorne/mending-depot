import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddReplacementCoverForm from '../components/AddReplacementCoverForm'

function ReplacementCovers() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Replacement Covers</title>
        <meta name="description" content="Manage Replacement Covers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          Replacement Covers
        </div>
        <div className="mx-auto">
          <AddReplacementCoverForm/>
        </div>
        <div className="mx-auto">
          <Table table={"replacementcovers"}/>
        </div>
		  </div>
    </SWRConfig>
  )
}

export default ReplacementCovers