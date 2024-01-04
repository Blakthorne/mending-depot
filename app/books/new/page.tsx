'use client'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import AddBookForm from './AddBookForm'

function NewBook() {
    return (
        <SWRConfig
            value = {{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <Head>
                <title>Add Book</title>
                <meta name="description" content="Add A New Book" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide">Books</div>
                <div className="mx-auto">
                    <AddBookForm/>
                </div>
            </div>
        </SWRConfig>
    )
}

export default NewBook