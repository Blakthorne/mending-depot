import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Mending Depot</title>
        <meta name="description" content="Helpful for the book mending business" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-slate-500">
        <p className="font-sans text-slate-200 text-3xl mt-56 text-center drop-shadow-lg tracking-wide">
          I meet your book mending needs.
        </p>
		  </div>
    </Layout>
  )
}
