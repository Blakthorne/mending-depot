import Head from 'next/head'
import { SWRConfig } from 'swr'
import Table from '../components/Table'
import AddBookForm from '../components/AddBookForm'

function Books() {
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Books</title>
                <meta name="description" content="Manage Books" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Books</div>
                <div className="mx-auto">
                    <AddBookForm/>
                </div>
                <div className="mx-auto">
                    <Table table={"books"}/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default Books