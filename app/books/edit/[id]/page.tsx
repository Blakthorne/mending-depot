'use client'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import EditBookForm from './EditBookForm'

function Books({ params }: {params: { id: string } }) {
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Edit Book</title>
                <meta name="description" content="Edit A Book" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Edit Book</div>
                <div className="mx-auto">
                    <EditBookForm bookId={ params.id }/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default Books