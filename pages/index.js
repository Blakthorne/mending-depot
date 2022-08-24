import { data } from 'autoprefixer';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import Layout from '../components/layout';
import useSWR, { SWRConfig } from 'swr'
import React, { useState } from 'react'
import Router from 'next/router'
import Table from '../components/Table'

export default function Home() {

  

  // const [ownerId, setOwnerId] = useState('')
  // const [ownerName, setOwnerName] = useState('')

  // const submitData = async e => {
  //   e.preventDefault()
  //   try {
  //     const body = { ownerId, ownerName }
  //     await fetch(`/api/owner`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(body),
  //     })
  //     await Router.push('/')
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  const table = 'books'
  
  return (
    <SWRConfig
      value = {{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
    <Layout>
      <Head>
        <title>Mending Depot</title>
        <meta name="description" content="Helpful for the book mending business" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-slate-500">
        <div className="font-sans text-slate-200 text-3xl mt-56 text-center drop-shadow-lg tracking-wide">
          I meet your book mending needs.
        </div>
        <div className="m-auto">
          <Table table={table}/>
        </div>
		  </div>
    </Layout>
    </SWRConfig>
    
      

      /* <div className="page">
        <form
          onSubmit={submitData}>
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={e => setOwnerId(e.target.value)}
            placeholder="Owner ID"
            type="text"
            value={ownerId}
          />
          <input
            onChange={e => setOwnerName(e.target.value)}
            placeholder="Owner Name"
            type="text"
            value={ownerName}
          />
          <input
            disabled={!ownerId || !ownerName}
            type="submit"
            value="Signup"
          />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
        </a>
        </form>
      </div>
      <style jsx>{`
      .page {
        background: white;
        padding: 3rem;
        display: flex;
        justify-content: center;
      }

      input[type='text'] {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 0.25rem;
        border: 0.125rem solid rgba(0, 0, 0, 0.2);
      }

      input[type='submit'] {
        background: rgba(0, 0, 0, 0.2);
        border: 0;
        padding: 1rem 2rem;
      }

      .back {
        margin-left: 1rem;
        color: black;
      }
    `}</style> */
  )
}
