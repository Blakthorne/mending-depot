import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddRepairForm from '../components/AddRepairForm';

function Repairs() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Repairs</title>
                <meta name="description" content="Manage Repairs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Repairs</div>
                <div className="mx-auto">
                    <AddRepairForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"repairs"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default Repairs
