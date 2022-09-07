import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddRepairTypeForm from '../components/AddRepairTypeForm';

function RepairTypes() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Repair Types</title>
        <meta name="description" content="Manage Repair Types" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          Repair Types
        </div>
        <div className="mx-auto">
          <AddRepairTypeForm/>
          <Table table={"repairtypes"}/>
        </div>
        <div>
          
      </div>
		  </div>
    </SWRConfig>
  )
}

export default RepairTypes
