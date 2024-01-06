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
    title: 'Add Binding Type',
    description: 'Add a new binding type to the database'
}
