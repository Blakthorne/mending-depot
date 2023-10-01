import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// Define an array of repairs as an array of type Repair
type Repairs = Repair[]

// Format the received and returned dates of the Book to be readable
function FormatDates(book): Book {
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

        return reformattedBook
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        
        // Get id of requested book
        const bookId = req.query.id as string

        // Pull book info from table
        let nonFormattedBook: Book = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        })

        // Format book dates
        let book = FormatDates(nonFormattedBook)

        // Pull owner info from table
        let owner: Owner = await prisma.owner.findUnique({
            where: {
                id: book.ownerId
            }
        })

        // Pull all repairs from table for the book
        let repairs: Repairs = await prisma.repair.findMany({
            where: {
                bookId: bookId
            }
        })
        res.status(200).json(book)
    }
}