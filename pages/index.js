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
import AddRepairTypeForm from '../components/AddRepairTypeForm';
import AddMaterialForRepairForm from '../components/AddMaterialForRepairForm';

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
          <h1>Owners</h1>
          <AddOwnerForm/>
          <Table table={"owners"}/>

          <h1>Manufacturers</h1>
          <AddManufacturerForm/>
          <Table table={"manufacturers"}/>

          <h1>Providers</h1>
          <AddProviderForm/>
          <Table table={"providers"}/>

          <h1>Books</h1>
          <AddBookForm/>
          <Table table={"books"}/>

          <h1>Repairs</h1>
          <AddRepairForm/>
          <Table table={"repairs"}/>

          <h1>Repair Types</h1>
          <AddRepairTypeForm/>
          <Table table={"repairtypes"}/>

          <h1>Materials</h1>
          <AddMaterialForm/>
          <Table table={"materials"}/>

          <h1>Replacement Covers</h1>
          <AddReplacementCover/>
          <Table table={"replacementcovers"}/>

          <h1>Inventory Transactions</h1>
          <AddInventoryTransactionForm/>
          <Table table={"inventorytransactions"}/>

          <h1>Material For Repairs</h1>
          <AddMaterialForRepairForm/>
          <Table table={"materialforrepair"}/>
        </div>
        <div>
          
      </div>
		  </div>
    </Layout>
    </SWRConfig>
  )
}

export default Home
