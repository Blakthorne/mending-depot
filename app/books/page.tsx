import { Metadata } from 'next'
import PrettyBookTable from './PrettyBookTable'

export default function ListBooks() {
    return (
        <div className="flex flex-col">
            <div className="text-3xl text-center tracking-wide">Books List</div>
            <div className="mx-auto">
                <PrettyBookTable/>
            </div>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'View Books List',
    description: 'Display all books in the database'
}