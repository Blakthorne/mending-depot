import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of books as an array of type Book
    type Books = Book[]

    if (req.method == 'GET') {
        let books: Books = await prisma.book.findMany()

        // For every book entry in the table, reformat the date entries into the format MM - DD -YYYY
        for (let i = 0; i < books.length; ++i) {
            let { id, title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = books[i]

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

            books[i] = reformattedBook
        }

        res.json(books)
    }
    if (req.method == 'POST') {
        let { title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = req.body

        // Ensure the new entries are in the correct format
        // Cannot use 'else if' on string empty checks for type checking reasons - TypeScript thinks they could still be non-strings
        if (publisher === '') publisher = null

        if (yearPublished === '') {
            yearPublished = null
        }
        if (typeof yearPublished === "string") {
            yearPublished = parseInt(yearPublished, 10)
        }

        if (numberOfPages === '') {
            numberOfPages = null
        }
        if (typeof numberOfPages === "string") {
            numberOfPages = parseInt(numberOfPages, 10)
        }

        if (typeof received === "string") {
            received = new Date(parseInt(received.slice(10)), parseInt(received.slice(0, 2)) - 1, parseInt(received.slice(5, 7)))
            console.log(received)
        }

        if (returned === '') {
            returned = null
        }
        if (typeof returned === "string") {
            returned = new Date(parseInt(returned.slice(10)), parseInt(returned.slice(0, 2)) - 1, parseInt(returned.slice(5, 7)))
        }

        if (bookMaterialsCost === '') {
            bookMaterialsCost = null
        }
        if (typeof bookMaterialsCost === "string") {
            bookMaterialsCost = parseInt(bookMaterialsCost, 10)
        }

        if (amountCharged === '') {
            amountCharged = null
        }
        if (typeof amountCharged === "string") {
            amountCharged = parseInt(amountCharged, 10)
        }

        const book = await prisma.book.create({
            data: {
                title: title,
                author: author,
                publisher: publisher,
                yearPublished: yearPublished,
                numberOfPages: numberOfPages,
                bindingTypeId: bindingTypeId,
                received: received,
                returned: returned,
                bookMaterialsCost: bookMaterialsCost,
                amountCharged: amountCharged,
                ownerId: ownerId,
            },
        })

        res.status(200).json(book)
    }
}