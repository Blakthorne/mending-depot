'use client'

// import { Metadata } from 'next'
import { SWRConfig } from 'swr'
import Table from '../../components/Table'
import AddOwnerForm from '../../components/AddOwnerForm'

export default function Owners() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Owners</div>
                <div className="mx-auto">
                    <AddOwnerForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"owners"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

// export const metadata: Metadata = {
//     title: 'Owners',
//     description: 'Manage Owners',
// }