import { Metadata } from 'next';
import Table from '../components/Table';
import AddBindingTypeForm from './AddBindingTypeForm';

export default function BindingTypes() {  
    return (
        <div>
            <AddBindingTypeForm/>
            <Table table={"bindingtypes"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Binding Types',
    description: 'View and add binding types'
}
