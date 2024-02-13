import { Metadata } from 'next'
import AddRepairs from './AddRepairs'

export default function Books({ params }: {params: { id: string } }) {
    return (
        <div>
            <AddRepairs bookId={ params.id }/>
        </div>
    )
}

export async function generateMetadata(
    { params }: { params: { id: string } }
    ): Promise<Metadata> {
   
    // fetch data
    const book: Book = await fetch(process.env.URL + "/api/books/" + params.id).then((res) => res.json())

    return {
        title: "Add Repairs to '" + book.title + "'",
        description: "Add repairs to book with the title '" + book.title + "'"
    }
}