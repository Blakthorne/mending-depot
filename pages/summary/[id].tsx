import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Summary({ data }) {
    const router = useRouter()
    return (
    <Head>
        <title>Summary for {router.query.id}</title>
        <meta name="description" content="Repair Summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    )

}

// export async function getServerSideProps() {
//     const router = useRouter()

//     // const res = await fetch(`https://.../data`)
//     const data = router.query.id//await res.json()

//     // Pass data to the page via props
//     return { props: { data } }
// }