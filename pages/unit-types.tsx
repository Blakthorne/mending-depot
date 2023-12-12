import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddUnitTypeForm from '../components/AddUnitTypeForm'

function UnitTypes() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Unit Types</title>
                <meta name="description" content="Manage Unit Types" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Unit Types</div>
                <div className="mx-auto">
                    <AddUnitTypeForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"unittypes"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default UnitTypes