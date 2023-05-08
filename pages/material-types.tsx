import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddMaterialTypeForm from '../components/AddMaterialTypeForm'

function MaterialTypes() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Material Types</title>
        <meta name="description" content="Manage Material Types" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          Material Types
        </div>
        <div className="mx-auto">
          <AddMaterialTypeForm/>
        </div>
        <div className="mx-auto">
          <Table table={"materialtypes"}/>
        </div>
		  </div>
    </SWRConfig>
  )
}

export default MaterialTypes