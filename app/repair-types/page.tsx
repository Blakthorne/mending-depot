import { Metadata } from 'next';
import Table from '../components/Table';
import AddRepairTypeForm from './AddRepairTypeForm';

export default function RepairTypes() {  
    return (
        <div>
            <AddRepairTypeForm/>
            <Table table={"repairtypes"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Repair Types',
    description: 'View and add repair types'
}
