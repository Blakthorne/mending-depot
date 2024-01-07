import { Metadata } from 'next';
import Table from '../components/Table';
import AddManufacturerForm from './AddManufacturerForm';

export default function Manufacturers() {  
    return (
        <div>
            <AddManufacturerForm/>
            <Table table={"manufacturers"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Manufacturers',
    description: 'View and add manufacturers'
}
