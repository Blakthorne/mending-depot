import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddProviderForm from '../components/AddProviderForm';

function Providers() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Providers</title>
        <meta name="description" content="Manage Providers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
            Providers
        </div>
        <div className="mx-auto">
          <AddProviderForm/>
          <Table table={"providers"}/>
        </div>
        <div>
          
      </div>
		  </div>
    </SWRConfig>
  )
}

export default Providers
