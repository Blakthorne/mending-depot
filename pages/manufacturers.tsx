import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddManufacturerForm from '../components/AddManufacturerForm';

function Manufacturers() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Manufacturers</title>
        <meta name="description" content="Manage Manufacturers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          Manufacturers
        </div>
        <div className="mx-auto">
          <AddManufacturerForm/>
          <Table table={"manufacturers"}/>
        </div>
        <div>
          
      </div>
		  </div>
    </SWRConfig>
  )
}

export default Manufacturers
