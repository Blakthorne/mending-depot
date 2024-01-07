import { Metadata } from 'next'
import Table from '../components/Table'
import AddInventoryTransactionForm from './AddInventoryTransactionForm'

export default function InventoryTransactions() {  
    return (
        <div>
            <AddInventoryTransactionForm/>
            <Table table={"inventorytransactions"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Inventory Transactions',
    description: 'View and add inventory transactions'
}