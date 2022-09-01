import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    
    // Create type structure for a book entry
    type Book = {
        id?: string;
        title: string;
        author: string;
        publisher: string | null;
        yearPublished: string | number | null;
        numberOfPages: string | number | null;
        bindingType: string;
        received: string | Date;
        returned: string | Date | null;
        bookMaterialsCost: string | number | null;
        amountCharged: string | number | null;
        ownerId: string;
    }

    // Define an array of books as an array of type Book
    type Books = Book[]

    if (req.method == 'GET') {
        let books: Books = await prisma.book.findMany()

        // For every book entry in the table, reformat the date entries into the format MM - DD -YYYY
        for (let i = 0; i < books.length; ++i) {
            let { id, title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = books[i]

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

            const reformattedBook: Book = { id, title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }

            books[i] = reformattedBook
        }

        res.json(books)
    }
    if (req.method == 'POST') {
        let { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = req.body

        // Ensure the new entries are in the correct format
        if (publisher === '') publisher = null

        if (yearPublished === '') {
            yearPublished = null
        }
        else if (typeof yearPublished === "string") {
            yearPublished = parseInt(yearPublished, 10)
        }

        if (numberOfPages === '') {
            numberOfPages = null
        }
        else if (typeof numberOfPages === "string") {
            numberOfPages = parseInt(numberOfPages, 10)
        }

        bindingType = bindingType.toUpperCase()

        if (typeof received === "string") {
            received = new Date(parseInt(received.slice(10)), parseInt(received.slice(0, 2)), parseInt(received.slice(5, 7)))
        }

        if (returned === '') {
            returned = null
        }
        else if (typeof returned === "string") {
            returned = new Date(parseInt(returned.slice(10)), parseInt(returned.slice(0, 2)), parseInt(returned.slice(5, 7)))
        }

        if (bookMaterialsCost === '') {
            bookMaterialsCost = null
        }
        else if (typeof bookMaterialsCost === "string") {
            bookMaterialsCost = parseInt(bookMaterialsCost, 10)
        }

        if (amountCharged === '') {
            amountCharged = null
        }
        else if (typeof amountCharged === "string") {
            amountCharged = parseInt(amountCharged, 10)
        }

        const book: Book = await prisma.book.create({
            data: {
                title: title,
                author: author,
                publisher: publisher,
                yearPublished: yearPublished,
                numberOfPages: numberOfPages,
                bindingType: bindingType,
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