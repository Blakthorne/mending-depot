import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: {params: { id: string } } ) {

    // Get id of requested book
    const bookId = params.id

    // Pull book info from table
    let book: Book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })

    // Reformat the date entries into the format MM - DD -YYYY
    let { id, title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = book

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

    const reformattedBook: Book = { id, title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }

    book = reformattedBook

    return NextResponse.json(book)
}