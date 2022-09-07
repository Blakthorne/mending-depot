import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddRepairForm from '../components/AddRepairForm';
import AddMaterialForm from '../components/AddMaterialForm';
import AddReplacementCover from '../components/AddReplacementCover';
import AddInventoryTransactionForm from '../components/AddInventoryTransaction';
import AddRepairTypeForm from '../components/AddRepairTypeForm';
import AddMaterialForRepairForm from '../components/AddMaterialForRepairForm';

function Home() {  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Head>
        <title>Mending Depot</title>
        <meta name="description" content="Helpful for the book mending business" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="font-sans text-slate-200 text-3xl text-center drop-shadow-lg tracking-wide">
          I meet your book mending needs.
        </div>
        <div className="mx-auto">
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
    </SWRConfig>
  )
}

export default Home
