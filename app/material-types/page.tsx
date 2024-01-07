import { Metadata } from 'next'
import Table from '../components/Table'
import AddMaterialTypeForm from './AddMaterialTypeForm'

export default function MaterialTypes() {  
    return (
        <div>
            <AddMaterialTypeForm/>
            <Table table={"materialtypes"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Material Types',
    description: 'View and add material types'
}