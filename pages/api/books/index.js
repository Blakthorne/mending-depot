import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET') {
        const books = await prisma.book.findMany()
        res.json(books)
    }
    if (req.method == 'POST') {
        let { bookTitle, bookAuthor, bookPublisher, bookYearPublished, bookNumPages, bookBindingType, bookReceived, bookReturned, bookMaterialsCost, bookAmountCharged, bookOwner } = req.body

        if (bookPublisher == '') bookPublisher = null
        bookYearPublished = parseInt(bookYearPublished, 10)
        bookNumPages = parseInt(bookNumPages, 10)
        bookBindingType = bookBindingType.toUpperCase()
        bookReceived = bookReceived.slice(10) + '-' + bookReceived.slice(0, 2) + '-' + bookReceived.slice(5, 7)
        if (bookReturned == '') {
            bookReturned = null
        }
        else { bookReturned = bookReturned.slice(10) + '-' + bookReturned.slice(0, 2) + '-' + bookReturned.slice(5, 7) }
        bookMaterialsCost = parseFloat(bookMaterialsCost)
        bookAmountCharged = parseFloat(bookAmountCharged)

        const result = await prisma.book.create({
            data: {
                title: bookTitle,
                author: bookAuthor,
                publisher: bookPublisher,
                yearPublished: bookYearPublished,
                numberOfPages: bookNumPages,
                bindingType: bookBindingType,
                received: bookReceived,
                returned: bookReturned,
                bookMaterialsCost: bookMaterialsCost,
                amountCharged: bookAmountCharged,
                ownerId: bookOwner,
            },
        })
        res.status(200).json(result)
    }
}