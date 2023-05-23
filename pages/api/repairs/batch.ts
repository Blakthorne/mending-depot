import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type RepairSpecsType = {
    [key: string]: string;
}

type BatchReceived = {
    bookBody: Book;
    repairForms: string[];
    repairSpecs: RepairSpecsType;
}

/**
 * Ensure the new book entries are in the correct format
 * @param bookBody 
 * @returns The correctly formatted Book object
 */
function CheckBook(bookBody: Book): Book {
    // Cannot use 'else if' on string empty checks for type checking reasons - TypeScript thinks they could still be non-strings
    if (bookBody.publisher === '') bookBody.publisher = null

    if (bookBody.yearPublished === '') {
        bookBody.yearPublished = null
    }
    if (typeof bookBody.yearPublished === "string") {
        bookBody.yearPublished = parseInt(bookBody.yearPublished, 10)
    }

    if (bookBody.numberOfPages === '') {
        bookBody.numberOfPages = null
    }
    if (typeof bookBody.numberOfPages === "string") {
        bookBody.numberOfPages = parseInt(bookBody.numberOfPages, 10)
    }

    if (typeof bookBody.received === "string") {
        bookBody.received = new Date(parseInt(bookBody.received.slice(10)), parseInt(bookBody.received.slice(0, 2)) - 1, parseInt(bookBody.received.slice(5, 7)))
        console.log(bookBody.received)
    }

    if (bookBody.returned === '') {
        bookBody.returned = null
    }
    if (typeof bookBody.returned === "string") {
        bookBody.returned = new Date(parseInt(bookBody.returned.slice(10)), parseInt(bookBody.returned.slice(0, 2)) - 1, parseInt(bookBody.returned.slice(5, 7)))
    }

    if (bookBody.bookMaterialsCost === '') {
        bookBody.bookMaterialsCost = null
    }
    if (typeof bookBody.bookMaterialsCost === "string") {
        bookBody.bookMaterialsCost = parseInt(bookBody.bookMaterialsCost, 10)
    }

    if (bookBody.amountCharged === '') {
        bookBody.amountCharged = null
    }
    if (typeof bookBody.amountCharged === "string") {
        bookBody.amountCharged = parseInt(bookBody.amountCharged, 10)
    }

    return bookBody
}

async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST')
    {
        let { bookBody, repairForms, repairSpecs }: BatchReceived = req.body

        const book: Book = CheckBook(bookBody)

        let tapeCost: number = 0

        for (let repair of repairForms) {
            if (repair === 'f63bc7dd-ac8e-4abe-9526-242fd3a54a15') {
                let tapeMaterial: Material = await prisma.material.findUnique({
                    where: {
                        id: repairSpecs.archivalTapeMaterial,
                    },
                })
                if (typeof tapeMaterial.unitCost === "string") {
                    tapeMaterial.unitCost = parseInt(tapeMaterial.unitCost, 10)
                }
                tapeCost = tapeMaterial.unitCost * parseInt(repairSpecs.tapeLength, 10)
            }
        }


        res.status(200).json(tapeCost)
    }
}


export default handle