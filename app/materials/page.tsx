import { Metadata } from 'next';
import Table from '../components/Table';
import AddMaterialForm from './AddMaterialForm';

export default function Materials() {  
    return (
        <div>
            <AddMaterialForm/>
            <Table table={"materials"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Materials',
    description: 'View and add materials'
}
