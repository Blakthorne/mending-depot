import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddMaterialForm from '../components/AddMaterialForm';

function Materials() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Materials</title>
        <meta name="description" content="Manage Materials" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          Materials
        </div>
        <div className="mx-auto">
          <AddMaterialForm/>
          <Table table={"materials"}/>
        </div>
        <div>
          
      </div>
		  </div>
    </SWRConfig>
  )
}

export default Materials
