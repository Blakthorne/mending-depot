'use client'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table';
import AddMaterialForm from './AddMaterialForm';

function Materials() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Materials</title>
                <meta name="description" content="Manage Materials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Materials</div>
                <div className="mx-auto">
                    <AddMaterialForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"materials"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default Materials
