import { Metadata } from 'next'
import Table from '../components/Table'

export default function TypesForMaterials() {
    return (
        <Table table={"typesformaterials/readable"}/>
    )
}

export const metadata: Metadata = {
    title: 'Types for Materials',
    description: 'View types for materials'
}