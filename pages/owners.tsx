import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddOwnerForm from '../components/AddOwnerForm'

function Owners() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Owners</title>
        <meta name="description" content="Manage Owners" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          Owners
        </div>
        <div className="mx-auto">
          <AddOwnerForm/>
        </div>
        <div className="mx-auto">
          <Table table={"owners"}/>
        </div>
		  </div>
    </SWRConfig>
  )
}

export default Owners