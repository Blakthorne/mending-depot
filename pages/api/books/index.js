import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET') {
        const books = await prisma.book.findMany()

        // for (let i = 0; i < books.length; ++i) {
        //     console.log("hi")
        //     let { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId } = books[i] 

        //     if (received == null) received = ''
        //     else {
        //         let month = received.getMonth()
        //         if (month < 10) month = '0' + month

        //         let day = received.getDate()
        //         if (day < 10) day = '0' + day

        //         let year = recevied.getYear()
                
        //         received = month + ' - ' + day + ' - ' + year
        //     }

        //     if (returned == null) returned = ''
        //     else {
        //         let month = returned.getMonth()
        //         if (month < 10) month = '0' + month

        //         let day = returned.getDate()
        //         if (day < 10) day = '0' + day

        //         let year = returned.getYear()
                
        //         returned = month + ' - ' + day + ' - ' + year
        //     }
        // }
        res.json(books)
    }
    if (req.method == 'POST') {
        let { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId } = req.body

        if (publisher == '') publisher = null
        yearPublished == '' ? yearPublished = null : yearPublished =  parseInt(yearPublished, 10)
        numberOfPages == '' ? numberOfPages = null : numberOfPages = parseInt(numberOfPages, 10)
        bindingType = bindingType.toUpperCase()
        let receivedDate = new Date(received.slice(10), received.slice(0, 2), received.slice(5, 7))
        let returnedDate = null
        returned == '' ? returned = null : returnedDate = new Date(returned.slice(10), returned.slice(0, 2), returned.slice(5, 7))
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