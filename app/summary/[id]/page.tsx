import { Metadata } from 'next'
import BookSummary from './BookSummary'

export default function Summary({ params }: { params: { id: string } }) {
    return (
        <div className="mx-auto">
            <BookSummary bookId={ params.id }/>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Book Summary',
    description: 'Book Summary'
}