import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET') {
        let books = await prisma.book.findMany()

        // For every book entry in the table, reformat the date entries into the format MM - DD -YYYY
        for (let i = 0; i < books.length; ++i) {
            let { id, title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId } = books[i]

            if (received == null) received = ''
            else {
                received = received.toJSON()
                received = received.slice(5,7) + ' - ' + received.slice(8,10) + ' - ' + received.slice(0,4)
            }

            if (returned == null) returned = ''
            else {
                returned = returned.toJSON()
                returned = returned.slice(5,7) + ' - ' + returned.slice(8,10) + ' - ' + returned.slice(0,4)
            }

            books[i] = { id, title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }
        }

        res.json(books)
    }
    if (req.method == 'POST') {
        let { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId } = req.body

        // Ensure the new entries are in the correct format
        if (publisher == '') publisher = null
        yearPublished == '' ? yearPublished = null : yearPublished =  parseInt(yearPublished, 10)
        numberOfPages == '' ? numberOfPages = null : numberOfPages = parseInt(numberOfPages, 10)
        bindingType = bindingType.toUpperCase()
        let receivedDate = new Date(received.slice(10), received.slice(0, 2), received.slice(5, 7))
        let returnedDate = null
        returned == '' ? returnedDate = null : returnedDate = new Date(returned.slice(10), returned.slice(0, 2), returned.slice(5, 7))
        bookMaterialsCost == '' ? bookMaterialsCost = null : bookMaterialsCost = parseFloat(bookMaterialsCost)
        amountCharged == '' ? amountCharged = null : amountCharged = parseFloat(amountCharged)

        const result = await prisma.book.create({
            data: {
                title: title,
                author: author,
                publisher: publisher,
                yearPublished: yearPublished,
                numberOfPages: numberOfPages,
                bindingType: bindingType,
                received: receivedDate,
                returned: returnedDate,
                bookMaterialsCost: bookMaterialsCost,
                amountCharged: amountCharged,
                ownerId: ownerId,
            },
        })

        res.status(200).json(result)
    }
}