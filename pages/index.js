import Head from 'next/head'
import Layout from '../components/Layout';
import { SWRConfig, useSWRConfig } from 'swr'
import Table from '../components/Table'
import AddOwnerForm from '../components/AddOwnerForm'
import AddBookForm from '../components/AddBookForm'
import AddRepairForm from '../components/AddRepairForm';
import AddMaterialForm from '../components/AddMaterialForm';
import AddReplacementCover from '../components/AddReplacementCover';
import AddManufacturerForm from '../components/AddManufacturerForm';
import AddInventoryTransactionForm from '../components/AddInventoryTransaction';
import AddProviderForm from '../components/AddProviderForm';

function Home() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
    <Layout>
      <Head>
        <title>Mending Depot</title>
        <meta name="description" content="Helpful for the book mending business" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen mt-16 bg-slate-500">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          I meet your book mending needs.
        </div>
        <div className="mx-auto">
          <AddOwnerForm/>
          <Table table={"owners"}/>

          <AddManufacturerForm/>
          <Table table={"manufacturers"}/>

          <AddProviderForm/>
          <Table table={"providers"}/>

          <AddBookForm/>
          <Table table={"books"}/>

          <AddRepairForm/>
          <Table table={"repairs"}/>

          <AddMaterialForm/>
          <Table table={"materials"}/>

          <AddReplacementCover/>
          <Table table={"replacementcovers"}/>

          <AddInventoryTransactionForm/>
          <Table table={"inventorytransactions"}/>

        </div>
        <div>
          
      </div>
		  </div>
    </Layout>
    </SWRConfig>
  )
}

export default Home
