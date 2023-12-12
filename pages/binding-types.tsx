import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddBindingTypeForm from '../components/AddBindingTypeForm';

function BindingTypes() {  
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Binding Types</title>
                <meta name="description" content="Manage Binding Types" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Binding Types</div>
                <div className="mx-auto">
                    <AddBindingTypeForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"bindingtypes"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default BindingTypes
