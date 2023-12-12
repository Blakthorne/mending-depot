import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddInventoryTransactionForm from '../components/AddInventoryTransactionForm'

function InventoryTransactions() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Inventory Transactions</title>
                <meta name="description" content="Manage Inventory Transactions" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Inventory Transactions</div>
                <div className="mx-auto">
                    <AddInventoryTransactionForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"inventorytransactions"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default InventoryTransactions