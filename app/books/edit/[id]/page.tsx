import { Metadata } from 'next'
import EditBookForm from './EditBookForm'

export default function Books({ params }: {params: { id: string } }) {
    return (
        <div>
            <EditBookForm bookId={ params.id }/>
        </div>
    )
}

export async function generateMetadata(
    { params }: { params: { id: string } }
    ): Promise<Metadata> {
   
    // fetch data
    const book: Book = await fetch(process.env.URL + "/api/books/" + params.id).then((res) => res.json())

    return {
    title: "Edit '" + book.title + "'",
    description: "Edit book with the title '" + book.title + "'"
    }
}