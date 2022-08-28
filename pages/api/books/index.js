import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET') {
        const books = await prisma.book.findMany()
        res.json(books)
    }
    if (req.method == 'POST') {
        let { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId } = req.body

        if (publisher == '') publisher = null
        yearPublished = parseInt(yearPublished, 10)
        numberOfPages = parseInt(numberOfPages, 10)
        bindingType = bindingType.toUpperCase()
        received = received.slice(10) + '-' + received.slice(0, 2) + '-' + received.slice(5, 7)
        if (returned == '') {
            returned = null
        }
        else { returned = returned.slice(10) + '-' + returned.slice(0, 2) + '-' + returned.slice(5, 7) }
        bookMaterialsCost = parseFloat(bookMaterialsCost)
        amountCharged = parseFloat(amountCharged)

        const book = await prisma.book.create({
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
                owner: {
                    connect: { id: ownerId}
                },
            },
        })
        res.status(200).json(book)
    }
}