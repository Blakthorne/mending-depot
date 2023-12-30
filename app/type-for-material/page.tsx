'use client'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'

function TypesForMaterials() {
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Types For Materials</title>
                <meta name="description" content="Manage Types For Materials" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Types For Materials</div>
                <div className="mx-auto">
                    <Table table={"typesformaterials/readable"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default TypesForMaterials