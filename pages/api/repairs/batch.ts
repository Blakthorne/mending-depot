import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

type RepairSpecsType = {
    [key: string]: string;
}

type BatchReceived = {
    bookBody: Book;
    repairForms: string[];
    repairSpecs: RepairSpecsType;
}

async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST')
    {
        let { bookBody, repairForms, repairSpecs }: BatchReceived = req.body

        let tapeCost: number = 0

        const repairAdditions = await prisma.$transaction(async (tx: PrismaClient) => {

            // Break out the bookBody object into the respective components
            let { title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = bookBody
        
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

            // Create the new book
            const newBook: Book = await tx.book.create({
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
                }
            })

            for (let repair of repairForms) {

                // Paper Repair
                if (repair === 'f63bc7dd-ac8e-4abe-9526-242fd3a54a15') {

                    // Retrieve the entry for the material used
                    let tapeMaterial: Material = await prisma.material.findUnique({
                        where: {
                            id: repairSpecs.archivalTapeMaterial,
                        },
                    })

                    // Ensure unitCost is an Int
                    if (typeof tapeMaterial.unitCost === "string") {
                        tapeMaterial.unitCost = parseInt(tapeMaterial.unitCost, 10)
                    }

                    // Calculate the materials cost
                    tapeCost = tapeMaterial.unitCost * parseInt(repairSpecs.tapeLength, 10)

                    // Create a new repair entry
                    // Can add repairMaterialsCost already because only one material used in this repair
                    const paperRepair: Repair = await tx.repair.create({
                        data: {
                            bookId: newBook.id,
                            repairTypeId: repair,
                            repairMaterialsCost: tapeCost,
                        }
                    })

                    // Create a new Material For Repair entry
                    await tx.materialForRepair.create({
                        data: {
                            repairId: paperRepair.id,
                            materialId: tapeMaterial.id,
                            amountUsed: parseInt(repairSpecs.tapeLength, 10)
                        }
                    })
                }
            }
        })


        res.status(200).json(repairAdditions)
    }
}


export default handle