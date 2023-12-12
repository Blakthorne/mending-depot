import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddMaterialForRepairForm from '../components/AddMaterialForRepairForm'

function MaterialForRepairs() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Material For Repairs</title>
                <meta name="description" content="Manage Material For Repairs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
            <div className="text-3xl text-center tracking-wide">Material For Repairs</div>
            <div className="mx-auto">
                <AddMaterialForRepairForm/>
            </div>
            <div className="mx-auto">
                <Table table={"materialforrepair"}/>
            </div>
                </div>
        </SWRConfig>
    )
}

export default MaterialForRepairs