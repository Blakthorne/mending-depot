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

// Constant variables
const TIPIN_GLUE_WEIGHT: number = .01
const BASEHINGE_GLUE_WEIGHT: number = .05

/**
 * Perform operations necessary when for a paper repair, inluding--
 *      Retrieving the material specified,
 *      Calculating cost for the repair,
 *      Adding a new entry in the Repair table,
 *      Adding a new entry in the MaterialForRepair table
 * 
 * @param tx the given instance of PrismaClient
 * @param repair the current repair in the iteration of repairForms
 * @param repairSpecs all the specs given in the form for all repairs on the book
 * @param book the book entry
 */
async function createPaperRepair(tx: PrismaClient, repair: string, repairSpecs: RepairSpecsType, book: Book) {
    // Retrieve the entry for the material used
    let material: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.archivalTapeMaterial,
        },
    })

    // Ensure unitCost is an Int
    if (typeof material.unitCost === "string") {
        material.unitCost = parseInt(material.unitCost, 10)
    }

    // Calculate the materials cost
    let tapeCost: number = material.unitCost * parseInt(repairSpecs.tapeLength, 10)

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const paperRepair: Repair = await tx.repair.create({
        data: {
            bookId: book.id,
            repairTypeId: repair,
            repairMaterialsCost: tapeCost,
        }
    })

    // Create a new Material For Repair entry
    const materialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: paperRepair.id,
            materialId: material.id,
            amountUsed: parseInt(repairSpecs.tapeLength, 10)
        }
    })
}

/**
 * Perform operations necessary when for a tipin repair, inluding--
 *      Retrieving the material specified,
 *      Calculating cost for the repair,
 *      Adding a new entry in the Repair table,
 *      Adding a new entry in the MaterialForRepair table
 * 
 * @param tx the given instance of PrismaClient
 * @param repair the current repair in the iteration of repairForms
 * @param repairSpecs all the specs given in the form for all repairs on the book
 * @param book the book entry
 */
async function createTipinRepair(tx: PrismaClient, repair: string, repairSpecs: RepairSpecsType, book: Book) {
    // Retrieve the entry for the material used
    let material: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.glueMaterial,
        },
    })

    // Ensure unitCost is an Int
    if (typeof material.unitCost === "string") {
        material.unitCost = parseInt(material.unitCost, 10)
    }

    // Calculate the materials cost
    let glueCost: number = material.unitCost * TIPIN_GLUE_WEIGHT

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const tipinRepair: Repair = await tx.repair.create({
        data: {
            bookId: book.id,
            repairTypeId: repair,
            repairMaterialsCost: glueCost,
        }
    })

    // Create a new Material For Repair entry
    const materialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: tipinRepair.id,
            materialId: material.id,
            amountUsed: TIPIN_GLUE_WEIGHT,
        }
    })
}

/**
 * Perform operations necessary when for a base hinge tightening repair, inluding--
 *      Retrieving the material specified,
 *      Calculating cost for the repair,
 *      Adding a new entry in the Repair table,
 *      Adding a new entry in the MaterialForRepair table
 * 
 * @param tx the given instance of PrismaClient
 * @param repair the current repair in the iteration of repairForms
 * @param repairSpecs all the specs given in the form for all repairs on the book
 * @param book the book entry
 */
async function createBaseHingeRepair(tx: PrismaClient, repair: string, repairSpecs: RepairSpecsType, book: Book) {
    // Retrieve the entry for the material used
    let material: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.glueMaterial,
        },
    })

    // Ensure unitCost is an Int
    if (typeof material.unitCost === "string") {
        material.unitCost = parseInt(material.unitCost, 10)
    }

    // Calculate the materials cost
    let glueCost: number = material.unitCost * BASEHINGE_GLUE_WEIGHT

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const baseHingeRepair: Repair = await tx.repair.create({
        data: {
            bookId: book.id,
            repairTypeId: repair,
            repairMaterialsCost: glueCost,
        }
    })

    // Create a new Material For Repair entry
    const materialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: baseHingeRepair.id,
            materialId: material.id,
            amountUsed: BASEHINGE_GLUE_WEIGHT,
        }
    })
}

async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == 'POST')
    {
        let { bookBody, repairForms, repairSpecs }: BatchReceived = req.body

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
                    await createPaperRepair(tx, repair, repairSpecs, newBook)
                }

                // Tip In
                if (repair === 'f0053585-ecdf-422a-9c00-af015d19d316') {
                    await createTipinRepair(tx, repair, repairSpecs, newBook)
                }

                // Base Hinge Tightening
                if (repair === '9fd756df-83af-4556-87b5-78493cc131bd') {
                    await createBaseHingeRepair(tx, repair, repairSpecs, newBook)
                }
            }
        })


        res.status(200).json(repairAdditions)
    }
}


export default handle