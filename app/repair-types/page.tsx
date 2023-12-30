'use client'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table';
import AddRepairTypeForm from './AddRepairTypeForm';

function RepairTypes() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Repair Types</title>
                <meta name="description" content="Manage Repair Types" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Repair Types</div>
                <div className="mx-auto">
                    <AddRepairTypeForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"repairtypes"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default RepairTypes
