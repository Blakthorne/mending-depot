import { Metadata } from 'next'
import Table from '../components/Table'
import AddUnitTypeForm from './AddUnitTypeForm'

export default function UnitTypes() {  
    return (
        <div>
            <AddUnitTypeForm/>
            <Table table={"unittypes"}/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Unit Types',
    description: 'View and add unit types'
}