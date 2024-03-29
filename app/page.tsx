import { Metadata } from 'next'

export default async function Page() {
    return (
        <div className="text-3xl text-center tracking-wide m-auto">
            I meet your book mending needs.
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Home',
    description: 'Welcome to the Mending Depot',
}