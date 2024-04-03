import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Necessary to create this type since prisma returns `owner` property
// as an object rather than just the string due to the join
type OwnerProp = {
    ownerName: string;
}

// Define the new type for a formatted book in this case
type PrettyBook = {
    id: string;
    title: string;
    author: string;
    owner: OwnerProp | string;
    received: string | Date;
    returned: string | Date | null;
}

// Define an array of books as an array of type Book
type PrettyBooks = PrettyBook[]

// Force out of caching for clients that request from this route
export const dynamic = 'true'

export async function GET(req: NextRequest) {
    let books: PrettyBooks = await prisma.book.findMany({
        select: {
            id: true,
            title: true,
            author: true,
            owner: {
                select: {
                    ownerName: true,
                }
            },
            received: true,
            returned: true,
        }
    })

    // For every book entry in the table, reformat the date entries into the format MM - DD -YYYY
    // and reassign `owner` as the string rather than OwnerProp
    for (let i = 0; i < books.length; ++i) {
        let { id, title, author, owner, received, returned }: PrettyBook = books[i]

        if (received === null) received = ''
        else if (received instanceof Date) {
            received = received.toJSON()
            received = received.slice(5,7) + ' - ' + received.slice(8,10) + ' - ' + received.slice(0,4)
        }

        if (returned === null) returned = ''
        else if (returned instanceof Date) {
            returned = returned.toJSON()
            returned = returned.slice(5,7) + ' - ' + returned.slice(8,10) + ' - ' + returned.slice(0,4)
        }

        if (typeof owner !== "string") {
            owner = owner.ownerName
        }

        const reformattedBook: PrettyBook = { id, title, author, owner, received, returned }

        books[i] = reformattedBook
    }

    return NextResponse.json(books)
}