import { Metadata } from 'next';
import Table from '../components/Table';
import AddProviderForm from './AddProviderForm';

export default function Providers() {  
    return (
        <div>
            <AddProviderForm/>
            <Table table={"providers"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Providers',
    description: 'View and add providers'
}
