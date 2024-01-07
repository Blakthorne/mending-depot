import { Metadata } from 'next'
import Table from '../components/Table'
import AddOwnerForm from './AddOwnerForm'

export default function Owners() {  
    return (
        <div>
            <AddOwnerForm/>
            <Table table={"owners"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Binding Types',
    description: 'View and add binding types'
}