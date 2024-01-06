import { Metadata } from 'next'
import AddBookForm from './AddBookForm'

export default function NewBook() {
    return (
        <div>
            <AddBookForm/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Add Book',
    description: 'Add a new book to the database'
}