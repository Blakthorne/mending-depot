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
const BASEHINGE_GLUE_WEIGHT: number = .03
const SPINE_REPLACEMENT_GLUE_WEIGHT = .05
const FLYSHEET_REPLACEMENT_GLUE_WEIGHT = .08
const SPINE_EXTRA_HEIGHT: number = 2
const SPINE_EXTRA_WIDTH: number = 3
const SPINE_LINING_HEIGHT_SUBTRACTION: number = .25
const FLYSHEET_EXTRA_WIDTH_HEIGHT: number = 1.5
const FLYSHEET_JAPANESE_PAPER_WIDTH: number = .25
const FLYSHEET_CHEESCLOTH_HEIGHT_SUBTRACTION: number = 2
const FLYSHEET_CHEESECLOTH_WIDTH_ADDITION: number = 4

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
            amountUsed: parseInt(repairSpecs.tapeLength, 10),
            materialCost: tapeCost,
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
            materialCost: glueCost,
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
            materialCost: glueCost,
        }
    })
}

/**
 * Perform operations necessary when for a spine replacement, inluding--
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
async function createSpineReplacementRepair(tx: PrismaClient, repair: string, repairSpecs: RepairSpecsType, book: Book) {

    // Retrieve the entries for the materials used
    let spineMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.spineMaterial,
        },
    })

    let spineLiningMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.spineLiningMaterial,
        },
    })

    let caseLiningMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.caseLiningMaterial,
        },
    })

    let bookRibbonMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.bookRibbonMaterial,
        },
    })

    let glueMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.glueMaterial,
        },
    })

    // Ensure unitCost of all materials is an Int
    if (typeof spineMaterial.unitCost === "string") {
        spineMaterial.unitCost = parseInt(spineMaterial.unitCost, 10)
    }

    if (typeof spineLiningMaterial.unitCost === "string") {
        spineLiningMaterial.unitCost = parseInt(spineLiningMaterial.unitCost, 10)
    }

    if (typeof caseLiningMaterial.unitCost === "string") {
        caseLiningMaterial.unitCost = parseInt(caseLiningMaterial.unitCost, 10)
    }

    if (typeof bookRibbonMaterial.unitCost === "string") {
        bookRibbonMaterial.unitCost = parseInt(bookRibbonMaterial.unitCost, 10)
    }

    if (typeof glueMaterial.unitCost === "string") {
        glueMaterial.unitCost = parseInt(glueMaterial.unitCost, 10)
    }

    // Calculate the amount of materials used
    let spineMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) + SPINE_EXTRA_HEIGHT) * (parseInt(repairSpecs.spineWidth, 10) + SPINE_EXTRA_WIDTH)

    let spineLiningMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) - SPINE_LINING_HEIGHT_SUBTRACTION) * parseInt(repairSpecs.spineWidth, 10)

    let caseLiningMaterialUsed: number = parseInt(repairSpecs.textBlockHeight, 10) * parseInt(repairSpecs.spineWidth, 10)

    let bookRibbonMaterialUsed: number = parseInt(repairSpecs.spineWidth, 10)

    let glueMaterialUsed: number = SPINE_REPLACEMENT_GLUE_WEIGHT

    // Calculate the costs of materials
    let spineMaterialCost: number = spineMaterialUsed * spineMaterial.unitCost

    let spineLiningMaterialCost: number = spineLiningMaterialUsed * spineLiningMaterial.unitCost

    let caseLiningMaterialCost: number = caseLiningMaterialUsed * caseLiningMaterial.unitCost

    let bookRibbonMaterialCost1: number = bookRibbonMaterialUsed * bookRibbonMaterial.unitCost

    let bookRibbonMaterialCost2: number = bookRibbonMaterialUsed * bookRibbonMaterial.unitCost

    let glueMaterialCost: number = glueMaterialUsed * glueMaterial.unitCost

    // Calculate total cost for the repair
    const totalRepairCost: number = spineMaterialCost + spineLiningMaterialCost + caseLiningMaterialCost + bookRibbonMaterialCost1 + bookRibbonMaterialCost2 + glueMaterialCost

    // Create a new repair entry
    const spineReplacementRepair: Repair = await tx.repair.create({
        data: {
            bookId: book.id,
            repairTypeId: repair,
            repairMaterialsCost: totalRepairCost,
        }
    })

    // Create new Material For Repair entries
    const spineMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: spineMaterial.id,
            amountUsed: spineMaterialUsed,
            materialCost: spineMaterialCost,
        }
    })

    const spineLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: spineLiningMaterial.id,
            amountUsed: spineLiningMaterialUsed,
            materialCost: spineLiningMaterialCost,
        }
    })

    const caseLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: caseLiningMaterial.id,
            amountUsed: caseLiningMaterialUsed,
            materialCost: caseLiningMaterialCost,
        }
    })

    const bookRibbonMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost1,
        }
    })

    const bookRibbonMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost2,
        }
    })


    const glueMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: glueMaterial.id,
            amountUsed: glueMaterialUsed,
            materialCost: glueMaterialCost,
        }
    })
}

/**
 * Perform operations necessary when for a resewing, inluding--
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
async function createResewingRepair(tx: PrismaClient, repair: string, repairSpecs: RepairSpecsType, book: Book) {

    // Retrieve the entries for the materials used
    let material: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.threadMaterial,
        },
    })

    // Ensure unitCost is an Int
    if (typeof material.unitCost === "string") {
        material.unitCost = parseInt(material.unitCost, 10)
    }

    // Calculate the amount of materials used
    let threadMaterialUsed: number = parseInt(repairSpecs.textBlockHeight, 10) * parseInt(repairSpecs.numberOfSignatures, 10)

    // Calculate the materials cost
    let threadCost: number = material.unitCost * threadMaterialUsed

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const resewRepair: Repair = await tx.repair.create({
        data: {
            bookId: book.id,
            repairTypeId: repair,
            repairMaterialsCost: threadCost,
        }
    })

    // Create a new Material For Repair entry
    const materialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: resewRepair.id,
            materialId: material.id,
            amountUsed: threadMaterialUsed,
            materialCost: threadCost,
        }
    })
}

/**
 * Perform operations necessary when for a flysheet replacement, inluding--
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
async function createFlysheetRepair(tx: PrismaClient, repair: string, repairSpecs: RepairSpecsType, book: Book) {

    // Retrieve the entries for the materials used
    let spineLiningMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.spineLiningMaterial,
        },
    })

    let caseLiningMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.caseLiningMaterial,
        },
    })

    let flysheetMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.flysheetMaterial,
        },
    })

    let japanesePaperMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.japanesePaperMaterial,
        },
    })

    let cheeseclothMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.cheeseclothMaterial,
        },
    })

    let bookRibbonMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.bookRibbonMaterial,
        },
    })

    let glueMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.glueMaterial,
        },
    })

    // Ensure unitCost is an Int
    if (typeof spineLiningMaterial.unitCost === "string") {
        spineLiningMaterial.unitCost = parseInt(spineLiningMaterial.unitCost, 10)
    }

    if (typeof caseLiningMaterial.unitCost === "string") {
        caseLiningMaterial.unitCost = parseInt(caseLiningMaterial.unitCost, 10)
    }

    if (typeof flysheetMaterial.unitCost === "string") {
        flysheetMaterial.unitCost = parseInt(flysheetMaterial.unitCost, 10)
    }

    if (typeof japanesePaperMaterial.unitCost === "string") {
        japanesePaperMaterial.unitCost = parseInt(japanesePaperMaterial.unitCost, 10)
    }

    if (typeof cheeseclothMaterial.unitCost === "string") {
        cheeseclothMaterial.unitCost = parseInt(cheeseclothMaterial.unitCost, 10)
    }

    if (typeof bookRibbonMaterial.unitCost === "string") {
        bookRibbonMaterial.unitCost = parseInt(bookRibbonMaterial.unitCost, 10)
    }

    if (typeof glueMaterial.unitCost === "string") {
        glueMaterial.unitCost = parseInt(glueMaterial.unitCost, 10)
    }

    // Calculate the amount of materials used
    let spineLiningMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) - SPINE_LINING_HEIGHT_SUBTRACTION) * parseInt(repairSpecs.spineWidth, 10)

    let caseLiningMaterialUsed: number = parseInt(repairSpecs.textBlockHeight, 10) * parseInt(repairSpecs.spineWidth, 10)

    let flysheetMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * (parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT)

    let japanesePaperMaterialUsed: number = parseInt(repairSpecs.textBlockHeight, 10) * FLYSHEET_JAPANESE_PAPER_WIDTH

    let cheeseclothMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) - FLYSHEET_CHEESCLOTH_HEIGHT_SUBTRACTION) * (parseInt(repairSpecs.spineWidth) + FLYSHEET_CHEESECLOTH_WIDTH_ADDITION)

    let bookRibbonMaterialUsed: number = parseInt(repairSpecs.spineWidth, 10)

    let glueMaterialUsed: number = FLYSHEET_REPLACEMENT_GLUE_WEIGHT

    // Calculate the costs of materials

    let spineLiningMaterialCost: number = spineLiningMaterialUsed * spineLiningMaterial.unitCost

    let caseLiningMaterialCost: number = caseLiningMaterialUsed * caseLiningMaterial.unitCost

    let flysheetMaterialCost1: number = flysheetMaterialUsed * flysheetMaterial.unitCost

    let flysheetMaterialCost2: number = flysheetMaterialUsed * flysheetMaterial.unitCost

    let japanesePaperMaterialCost1: number = japanesePaperMaterialUsed * japanesePaperMaterial.unitCost

    let japanesePaperMaterialCost2: number = japanesePaperMaterialUsed * japanesePaperMaterial.unitCost

    let cheeseclothMaterialCost: number = cheeseclothMaterialUsed * cheeseclothMaterial.unitCost

    let bookRibbonMaterialCost1: number = bookRibbonMaterialUsed * bookRibbonMaterial.unitCost

    let bookRibbonMaterialCost2: number = bookRibbonMaterialUsed * bookRibbonMaterial.unitCost

    let glueMaterialCost: number = glueMaterialUsed * glueMaterial.unitCost

    // Calculate the total materials cost
    const totalRepairCost: number = spineLiningMaterialCost + caseLiningMaterialCost + flysheetMaterialCost1 + flysheetMaterialCost2 + japanesePaperMaterialCost1 + japanesePaperMaterialCost2 + cheeseclothMaterialCost + bookRibbonMaterialCost1 + bookRibbonMaterialCost2 + glueMaterialCost

    // Create a new repair entry
    const flysheetReplacementRepair: Repair = await tx.repair.create({
        data: {
            bookId: book.id,
            repairTypeId: repair,
            repairMaterialsCost: totalRepairCost,
        }
    })

    // Create new Material For Repair entries
    const spineLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: spineLiningMaterial.id,
            amountUsed: spineLiningMaterialUsed,
            materialCost: spineLiningMaterialCost,
        }
    })

    const caseLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: caseLiningMaterial.id,
            amountUsed: caseLiningMaterialUsed,
            materialCost: caseLiningMaterialCost,
        }
    })

    const flysheetMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: flysheetMaterial.id,
            amountUsed: flysheetMaterialUsed,
            materialCost: flysheetMaterialCost1,
        }
    })

    const flysheetMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: flysheetMaterial.id,
            amountUsed: flysheetMaterialUsed,
            materialCost: flysheetMaterialCost2,
        }
    })

    const japanesePaperMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: japanesePaperMaterial.id,
            amountUsed: japanesePaperMaterialUsed,
            materialCost: japanesePaperMaterialCost1,
        }
    })

    const japanesePaperMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: japanesePaperMaterial.id,
            amountUsed: japanesePaperMaterialUsed,
            materialCost: japanesePaperMaterialCost2,
        }
    })

    const cheeseclothMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: cheeseclothMaterial.id,
            amountUsed: cheeseclothMaterialUsed,
            materialCost: cheeseclothMaterialCost,
        }
    })

    const bookRibbonMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost1,
        }
    })

    const bookRibbonMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost2,
        }
    })

    const glueMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: glueMaterial.id,
            amountUsed: glueMaterialUsed,
            materialCost: glueMaterialCost,
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

                // Spine Replacement
                if (repair === '0252d235-e96c-42c4-b06d-c8278f9ee51a') {
                    await createSpineReplacementRepair(tx, repair, repairSpecs, newBook)
                }

                // Resewing
                if (repair === '953a3ba2-4586-4977-a0ad-de45afafccfb') {
                    await createResewingRepair(tx, repair, repairSpecs, newBook)
                }

                // Flysheet Replacement
                if (repair === 'a9b47354-b892-48e1-a3ce-bdb7e535b91e') {
                    await createFlysheetRepair(tx, repair, repairSpecs, newBook)
                }
            }
        })


        res.status(200).json(repairAdditions)
    }
}


export default handle