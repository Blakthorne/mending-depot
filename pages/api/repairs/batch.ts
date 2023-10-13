import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'

type RepairSpecsType = {
    [key: string]: string;
}

type BatchReceived = {
    bookBody: Book;
    repairForms: RepairType[];
    repairSpecs: RepairSpecsType;
}

// Constant variables
const TIPIN_GLUE_WEIGHT: number = .01
const BASEHINGE_GLUE_WEIGHT: number = .03
const SPINE_REPLACEMENT_GLUE_WEIGHT = .05
const FLYSHEET_REPLACEMENT_GLUE_WEIGHT = .08
const COVER_REPLACEMENT_GLUE_WEIGHT = .1

const SPINE_EXTRA_HEIGHT: number = 2
const SPINE_EXTRA_WIDTH: number = 3

const SPINE_LINING_HEIGHT_SUBTRACTION: number = .25

const FLYSHEET_EXTRA_WIDTH_HEIGHT: number = 1.5
const FLYSHEET_JAPANESE_PAPER_WIDTH: number = .25
const FLYSHEET_CHEESCLOTH_HEIGHT_SUBTRACTION: number = 2
const FLYSHEET_CHEESECLOTH_WIDTH_ADDITION: number = 4

const COVER_BOOK_BOARD_EXTRA_HEIGHT: number = .25
const COVER_BOOK_BOARD_EXTRA_WIDTH: number = .0625
const COVER_MATERIAL_EXTRA_WIDTH_HEIGHT: number = .625
const COVER_LINING_STRIP_WIDTH: number = .125
const COVER_QUARTER_BOUND_SPINE_EXTRA_WIDTH: number = 2

/**
 * Update the bookMaterialsCost cost of the provided Book entry
 * with the given added amount
 * 
 * @param tx
 * @param bookId
 * @param costUpdate 
 */
async function updateBookMaterialsCost(tx: PrismaClient, bookId: string, costUpdate: number) {

    // Retrieve the book
    let book: Book = await tx.book.findUnique({
        where: {
            id: bookId
        }
    })

    // Set bookMaterialsCost in book entry to `0` since `increment` won't work if it is `null`
    if (book.bookMaterialsCost === null) {
        await tx.book.update({
            where: {
                id: book.id
            },
            data: {
                bookMaterialsCost: 0
            }
        })
    }

    // Update bookMaterialsCost in book entry
    await tx.book.update({
        where: {
            id: book.id
        },
        data: {
            bookMaterialsCost: {
                increment: costUpdate
            }
        }
    })
}

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
async function createPaperRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {
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

    await updateBookMaterialsCost(tx, bookId, tapeCost)

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const paperRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
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
async function createTipinRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {

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

    await updateBookMaterialsCost(tx, bookId, glueCost)

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const tipinRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
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
async function createBaseHingeRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {

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

    await updateBookMaterialsCost(tx, bookId, glueCost)

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const baseHingeRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
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
async function createSpineReplacementRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {

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

    await updateBookMaterialsCost(tx, bookId, totalRepairCost)

    // Create a new repair entry
    const spineReplacementRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
            repairMaterialsCost: totalRepairCost,
        }
    })

    // Create new Material For Repair entries, along with necessary MaterialWidth and MaterialHeight entries
    // Spine Material
    const spineMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: spineMaterial.id,
            amountUsed: spineMaterialUsed,
            materialCost: spineMaterialCost,
        }
    })

    const spineMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: spineMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10) + SPINE_EXTRA_WIDTH,
        }
    })

    const spineMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: spineMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + SPINE_EXTRA_HEIGHT,
        }
    })

    // Spine Lining
    const spineLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: spineLiningMaterial.id,
            amountUsed: spineLiningMaterialUsed,
            materialCost: spineLiningMaterialCost,
        }
    })

    const spineLiningMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: spineLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10),
        }
    })

    const spineLiningMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: spineLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) - SPINE_LINING_HEIGHT_SUBTRACTION,
        }
    })

    // Case Lining
    const caseLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: caseLiningMaterial.id,
            amountUsed: caseLiningMaterialUsed,
            materialCost: caseLiningMaterialCost,
        }
    })

    const caseLiningMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: caseLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10),
        }
    })

    const caseLiningMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: caseLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Book Ribbon 1
    const bookRibbonMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost1,
        }
    })

    // Book Ribbon 2
    const bookRibbonMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: spineReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost2,
        }
    })

    // Glue
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
async function createResewingRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {

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

    await updateBookMaterialsCost(tx, bookId, threadCost)

    // Create a new repair entry
    // Can add repairMaterialsCost already because only one material used in this repair
    const resewRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
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
async function createFlysheetRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {

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

    let flysheetMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * ((parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * 2)

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

    await updateBookMaterialsCost(tx, bookId, totalRepairCost)

    // Create a new repair entry
    const flysheetReplacementRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
            repairMaterialsCost: totalRepairCost,
        }
    })

    // Create new Material For Repair entries, along with with necessary MaterialWidth and MaterialHeigth entries
    // Spine Lining
    const spineLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: spineLiningMaterial.id,
            amountUsed: spineLiningMaterialUsed,
            materialCost: spineLiningMaterialCost,
        }
    })

    const spineLiningMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: spineLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10),
        }
    })

    const spineLiningMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: spineLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) - SPINE_LINING_HEIGHT_SUBTRACTION,
        }
    })

    // Case Lining
    const caseLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: caseLiningMaterial.id,
            amountUsed: caseLiningMaterialUsed,
            materialCost: caseLiningMaterialCost,
        }
    })

    const caseLiningMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: caseLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10),
        }
    })

    const caseLiningMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: caseLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Flysheet 1
    const flysheetMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: flysheetMaterial.id,
            amountUsed: flysheetMaterialUsed,
            materialCost: flysheetMaterialCost1,
        }
    })

    const flysheetMaterialWidth1: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair1.id,
            measurement: (parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * 2,
        }
    })

    const flysheetMaterialHeight1: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair1.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT,
        }
    })

    // Flysheet 2
    const flysheetMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: flysheetMaterial.id,
            amountUsed: flysheetMaterialUsed,
            materialCost: flysheetMaterialCost2,
        }
    })

    const flysheetMaterialWidth2: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair2.id,
            measurement: (parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * 2,
        }
    })

    const flysheetMaterialHeight2: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair2.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT,
        }
    })

    // Japanese Paper 1
    const japanesePaperMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: japanesePaperMaterial.id,
            amountUsed: japanesePaperMaterialUsed,
            materialCost: japanesePaperMaterialCost1,
        }
    })

    const japanesePaperWidth1: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair1.id,
            measurement: FLYSHEET_JAPANESE_PAPER_WIDTH,
        }
    })

    const japanesePaperHeight1: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair1.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Japanese Paper 2
    const japanesePaperMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: japanesePaperMaterial.id,
            amountUsed: japanesePaperMaterialUsed,
            materialCost: japanesePaperMaterialCost2,
        }
    })

    const japanesePaperWidth2: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair2.id,
            measurement: FLYSHEET_JAPANESE_PAPER_WIDTH,
        }
    })

    const japanesePaperHeight2: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair2.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Cheesecloth
    const cheeseclothMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: cheeseclothMaterial.id,
            amountUsed: cheeseclothMaterialUsed,
            materialCost: cheeseclothMaterialCost,
        }
    })

    const cheeseclothWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: cheeseclothMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth) + FLYSHEET_CHEESECLOTH_WIDTH_ADDITION,
        }
    })

    const cheeseclothHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: cheeseclothMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) - FLYSHEET_CHEESCLOTH_HEIGHT_SUBTRACTION,
        }
    })

    // Book Ribbon 1
    const bookRibbonMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost1,
        }
    })

    // Book Ribbon 2
    const bookRibbonMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost2,
        }
    })

    // Glue
    const glueMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: flysheetReplacementRepair.id,
            materialId: glueMaterial.id,
            amountUsed: glueMaterialUsed,
            materialCost: glueMaterialCost,
        }
    })
}

/**
 * Perform operations necessary when for a cover replacement, inluding--
 *      Retrieving the material specified,
 *      Calculating cost for the repair,
 *      Adding new entries in the Repair table,
 *      Adding new entries in the MaterialForRepair table
 * 
 * @param tx the given instance of PrismaClient
 * @param repair the current repair in the iteration of repairForms
 * @param repairSpecs all the specs given in the form for all repairs on the book
 * @param book the book entry
 */
async function createCoverRepair(tx: PrismaClient, repair: RepairType, repairSpecs: RepairSpecsType, bookId: string) {

    // Create variables for figuring out how to handle cover material amounts
    // Full-Bound vars
    let fullBoundCoverMaterialUsed: number = 0
    let fullBoundHeightTotal: number = 0
    let fullBoundWidthTotal: number = 0

    // Quarter-Bound vars
    let quarterBoundSpineMaterialUsed: number = 0
    let quarterBoundHeightSpineCovering: number = 0
    let quarterBoundWidthSpineCovering: number = 0

    let quarterBoundSideMaterialUsed: number = 0
    let quarterBoundHeightSideCovering: number = 0
    let quarterBoundWidthSideCovering: number = 0

    // Three-Quarter-Bound vars
    let threeQuarterBoundSpineMaterialUsed: number = 0
    let threeQuarterBoundSideMaterialUsed: number = 0
    let threeQuarterBoundCornerMaterialUsed: number = 0

    // Create variables for figuring out how to handle cover material costs
    // Full-Bound vars
    let fullBoundCoverMaterialCost: number = 0

    // Quarter-Bound vars
    let quarterBoundSpineMaterialCost: number = 0
    let quarterBoundSideMaterialCost1: number = 0
    let quarterBoundSideMaterialCost2: number = 0

    // Three-Quarter-Bound vars
    let threeQuarterBoundSpineMaterialCost: number = 0
    let threeQuarterBoundSideMaterialCost1: number = 0
    let threeQuarterBoundSideMaterialCost2: number = 0
    let threeQuarterBoundCornerMaterialCost1: number = 0
    let threeQuarterBoundCornerMaterialCost2: number = 0
    let threeQuarterBoundCornerMaterialCost3: number = 0
    let threeQuarterBoundCornerMaterialCost4: number = 0

    let totalCoverCost: number = 0

    // Retrieve the entries for the materials used
    let spineMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.spineMaterial,
        },
    })

    let sideMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.sideMaterial,
        },
    })

    let bookBoardMaterial: Material = await tx.material.findUnique({
        where: {
            id: repairSpecs.bookBoardMaterial,
        }
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
    if (typeof spineMaterial.unitCost === "string") {
        spineMaterial.unitCost = parseInt(spineMaterial.unitCost, 10)
    }

    if (typeof sideMaterial.unitCost === "string") {
        sideMaterial.unitCost = parseInt(sideMaterial.unitCost, 10)
    }

    if (typeof bookBoardMaterial.unitCost === "string") {
        bookBoardMaterial.unitCost = parseInt(bookBoardMaterial.unitCost, 10)
    }

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
    if (repairSpecs.coverType === "fullBound") {

        // Calculate height of material
        let heightBoardCovering: number = parseInt(repairSpecs.textBlockHeight, 10) + COVER_BOOK_BOARD_EXTRA_HEIGHT
        let heightExtraMargin: number = COVER_MATERIAL_EXTRA_WIDTH_HEIGHT * 2
        fullBoundHeightTotal = heightBoardCovering + heightExtraMargin

        // Calculate width of material
        let widthBoardCovering: number = (parseInt(repairSpecs.textBlockWidth, 10) + COVER_BOOK_BOARD_EXTRA_WIDTH) * 2
        let widthExtraMargin: number = (COVER_MATERIAL_EXTRA_WIDTH_HEIGHT * 2) + (COVER_LINING_STRIP_WIDTH * 2)
        fullBoundWidthTotal = widthBoardCovering + widthExtraMargin + parseInt(repairSpecs.spineWidth, 10)

        fullBoundCoverMaterialUsed = fullBoundHeightTotal * fullBoundWidthTotal
    }
    else if (repairSpecs.coverType === "quarterBound") {

        // Calculate spine material used
        quarterBoundHeightSpineCovering = parseInt(repairSpecs.textBlockHeight, 10) + (COVER_MATERIAL_EXTRA_WIDTH_HEIGHT * 2)
        quarterBoundWidthSpineCovering = parseInt(repairSpecs.spineWidth, 10) + (COVER_LINING_STRIP_WIDTH * 2) + (COVER_QUARTER_BOUND_SPINE_EXTRA_WIDTH * 2)

        quarterBoundSpineMaterialUsed = quarterBoundHeightSpineCovering * quarterBoundWidthSpineCovering

        // Calculate side material used
        quarterBoundHeightSideCovering = parseInt(repairSpecs.textBlockHeight, 10) + (COVER_MATERIAL_EXTRA_WIDTH_HEIGHT * 2)
        quarterBoundWidthSideCovering = parseInt(repairSpecs.textBlockWidth, 10) + COVER_MATERIAL_EXTRA_WIDTH_HEIGHT

        quarterBoundSideMaterialUsed = quarterBoundHeightSideCovering * quarterBoundWidthSideCovering
    }
    else if (repairSpecs.coverType === "threeQuarterBound") {
        // TODO
    }
    else { ; }

    let bookBoardMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) + COVER_BOOK_BOARD_EXTRA_HEIGHT) * (parseInt(repairSpecs.textBlockWidth, 10) + COVER_BOOK_BOARD_EXTRA_WIDTH);

    let spineLiningMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) - SPINE_LINING_HEIGHT_SUBTRACTION) * parseInt(repairSpecs.spineWidth, 10)

    let caseLiningMaterialUsed: number = parseInt(repairSpecs.textBlockHeight, 10) * parseInt(repairSpecs.spineWidth, 10)

    let flysheetMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * ((parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * 2)

    let japanesePaperMaterialUsed: number = parseInt(repairSpecs.textBlockHeight, 10) * FLYSHEET_JAPANESE_PAPER_WIDTH

    let cheeseclothMaterialUsed: number = (parseInt(repairSpecs.textBlockHeight, 10) - FLYSHEET_CHEESCLOTH_HEIGHT_SUBTRACTION) * (parseInt(repairSpecs.spineWidth) + FLYSHEET_CHEESECLOTH_WIDTH_ADDITION)

    let bookRibbonMaterialUsed: number = parseInt(repairSpecs.spineWidth, 10)

    let glueMaterialUsed: number = COVER_REPLACEMENT_GLUE_WEIGHT

    // Calculate the costs of materials
    if (repairSpecs.coverType === "fullBound") {
        fullBoundCoverMaterialCost = fullBoundCoverMaterialUsed * sideMaterial.unitCost

        totalCoverCost = fullBoundCoverMaterialCost
    }
    else if (repairSpecs.coverType === "quarterBound") {
        quarterBoundSpineMaterialCost = quarterBoundSpineMaterialUsed * spineMaterial.unitCost
        quarterBoundSideMaterialCost1 = quarterBoundSideMaterialUsed * sideMaterial.unitCost
        quarterBoundSideMaterialCost2 = quarterBoundSideMaterialUsed * sideMaterial.unitCost

        totalCoverCost = quarterBoundSpineMaterialCost + quarterBoundSideMaterialCost1 + quarterBoundSideMaterialCost2
    }
    else if (repairSpecs.coverType === "threeQuarterBound") {
        // TODO
    }
    else { ; }

    let bookBoardMaterialCost1: number = bookBoardMaterialUsed * bookBoardMaterial.unitCost

    let bookBoardMaterialCost2: number = bookBoardMaterialUsed * bookBoardMaterial.unitCost

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
    const totalRepairCost: number = totalCoverCost + bookBoardMaterialCost1 + bookBoardMaterialCost2 + spineLiningMaterialCost + caseLiningMaterialCost + flysheetMaterialCost1 + flysheetMaterialCost2 + japanesePaperMaterialCost1 + japanesePaperMaterialCost2 + cheeseclothMaterialCost + bookRibbonMaterialCost1 + bookRibbonMaterialCost2 + glueMaterialCost

    await updateBookMaterialsCost(tx, bookId, totalRepairCost)

    // Create a new repair entry
    const coverReplacementRepair: Repair = await tx.repair.create({
        data: {
            bookId: bookId,
            repairTypeId: repair.id,
            repairMaterialsCost: totalRepairCost,
        }
    })

    // Create new Material For Repair entries, along with with necessary MaterialWidth and MaterialHeigth entries
    // Cover
    if (repairSpecs.coverType === "fullBound") {
        const fullBoundCoverMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
            data: {
                repairId: coverReplacementRepair.id,
                materialId: sideMaterial.id,
                amountUsed: fullBoundCoverMaterialUsed,
                materialCost: fullBoundCoverMaterialCost,
            }
        })
    
        const fullBoundCoverMaterialWidth: MaterialWidth = await tx.materialWidth.create({
            data: {
                materialForRepairId: fullBoundCoverMaterialForRepair.id,
                measurement: fullBoundWidthTotal,
            }
        })
    
        const fullBoundCoverMaterialHeight: MaterialHeight = await tx.materialHeight.create({
            data: {
                materialForRepairId: fullBoundCoverMaterialForRepair.id,
                measurement: fullBoundHeightTotal,
            }
        })
    }
    else if (repairSpecs.coverType === "quarterBound") {
        
        // Spine
        const quarterBoundSpineMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
            data: {
                repairId: coverReplacementRepair.id,
                materialId: spineMaterial.id,
                amountUsed: quarterBoundSpineMaterialUsed,
                materialCost: quarterBoundSpineMaterialCost,
            }
        })
    
        const quarterBoundSpineMaterialWidth: MaterialWidth = await tx.materialWidth.create({
            data: {
                materialForRepairId: quarterBoundSpineMaterialForRepair.id,
                measurement: quarterBoundWidthSpineCovering,
            }
        })
    
        const quarterBoundSpineMaterialHeight: MaterialHeight = await tx.materialHeight.create({
            data: {
                materialForRepairId: quarterBoundSpineMaterialForRepair.id,
                measurement: quarterBoundHeightSpineCovering,
            }
        })

        // Side 1
        const quarterBoundSideMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
            data: {
                repairId: coverReplacementRepair.id,
                materialId: sideMaterial.id,
                amountUsed: quarterBoundSideMaterialUsed,
                materialCost: quarterBoundSideMaterialCost1,
            }
        })
    
        const quarterBoundSideMaterialWidth1: MaterialWidth = await tx.materialWidth.create({
            data: {
                materialForRepairId: quarterBoundSideMaterialForRepair1.id,
                measurement: quarterBoundWidthSideCovering,
            }
        })
    
        const quarterBoundsideMaterialHeight1: MaterialHeight = await tx.materialHeight.create({
            data: {
                materialForRepairId: quarterBoundSideMaterialForRepair1.id,
                measurement: quarterBoundHeightSideCovering,
            }
        })

        // Side 2
        const quarterBoundSideMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
            data: {
                repairId: coverReplacementRepair.id,
                materialId: sideMaterial.id,
                amountUsed: quarterBoundSideMaterialUsed,
                materialCost: quarterBoundSideMaterialCost2,
            }
        })
    
        const quarterBoundSideMaterialWidth2: MaterialWidth = await tx.materialWidth.create({
            data: {
                materialForRepairId: quarterBoundSideMaterialForRepair2.id,
                measurement: quarterBoundWidthSideCovering,
            }
        })
    
        const quarterBoundsideMaterialHeight2: MaterialHeight = await tx.materialHeight.create({
            data: {
                materialForRepairId: quarterBoundSideMaterialForRepair2.id,
                measurement: quarterBoundHeightSideCovering,
            }
        })
    }


    // Book Board 1
    const bookBoardMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: bookBoardMaterial.id,
            amountUsed: bookBoardMaterialUsed,
            materialCost: bookBoardMaterialCost1,
        }
    })

    const bookBoardMaterialWidth1: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: bookBoardMaterialForRepair1.id,
            measurement: parseInt(repairSpecs.textBlockWidth, 10) + COVER_BOOK_BOARD_EXTRA_WIDTH,
        }
    })

    const bookBoardMaterialHeight1: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: bookBoardMaterialForRepair1.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + COVER_BOOK_BOARD_EXTRA_HEIGHT,
        }
    })

    // Book Board 2
    const bookBoardMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: bookBoardMaterial.id,
            amountUsed: bookBoardMaterialUsed,
            materialCost: bookBoardMaterialCost2,
        }
    })

    const bookBoardMaterialWidth2: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: bookBoardMaterialForRepair2.id,
            measurement: parseInt(repairSpecs.textBlockWidth, 10) + COVER_BOOK_BOARD_EXTRA_WIDTH,
        }
    })

    const bookBoardMaterialHeight2: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: bookBoardMaterialForRepair2.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + COVER_BOOK_BOARD_EXTRA_HEIGHT,
        }
    })

    // Spine Lining
    const spineLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: spineLiningMaterial.id,
            amountUsed: spineLiningMaterialUsed,
            materialCost: spineLiningMaterialCost,
        }
    })

    const spineLiningMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: spineLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10),
        }
    })

    const spineLiningMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: spineLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) - SPINE_LINING_HEIGHT_SUBTRACTION,
        }
    })

    // Case Lining
    const caseLiningMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: caseLiningMaterial.id,
            amountUsed: caseLiningMaterialUsed,
            materialCost: caseLiningMaterialCost,
        }
    })

    const caseLiningMaterialWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: caseLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth, 10),
        }
    })

    const caseLiningMaterialHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: caseLiningMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Flysheet 1
    const flysheetMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: flysheetMaterial.id,
            amountUsed: flysheetMaterialUsed,
            materialCost: flysheetMaterialCost1,
        }
    })

    const flysheetMaterialWidth1: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair1.id,
            measurement: (parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * 2,
        }
    })

    const flysheetMaterialHeight1: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair1.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT,
        }
    })

    // Flysheet 2
    const flysheetMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: flysheetMaterial.id,
            amountUsed: flysheetMaterialUsed,
            materialCost: flysheetMaterialCost2,
        }
    })

    const flysheetMaterialWidth2: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair2.id,
            measurement: (parseInt(repairSpecs.textBlockWidth, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT) * 2,
        }
    })

    const flysheetMaterialHeight2: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: flysheetMaterialForRepair2.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) + FLYSHEET_EXTRA_WIDTH_HEIGHT,
        }
    })

    // Japanese Paper 1
    const japanesePaperMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: japanesePaperMaterial.id,
            amountUsed: japanesePaperMaterialUsed,
            materialCost: japanesePaperMaterialCost1,
        }
    })

    const japanesePaperWidth1: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair1.id,
            measurement: FLYSHEET_JAPANESE_PAPER_WIDTH,
        }
    })

    const japanesePaperHeight1: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair1.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Japanese Paper 2
    const japanesePaperMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: japanesePaperMaterial.id,
            amountUsed: japanesePaperMaterialUsed,
            materialCost: japanesePaperMaterialCost2,
        }
    })

    const japanesePaperWidth2: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair2.id,
            measurement: FLYSHEET_JAPANESE_PAPER_WIDTH,
        }
    })

    const japanesePaperHeight2: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: japanesePaperMaterialForRepair2.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10),
        }
    })

    // Cheesecloth
    const cheeseclothMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: cheeseclothMaterial.id,
            amountUsed: cheeseclothMaterialUsed,
            materialCost: cheeseclothMaterialCost,
        }
    })

    const cheeseclothWidth: MaterialWidth = await tx.materialWidth.create({
        data: {
            materialForRepairId: cheeseclothMaterialForRepair.id,
            measurement: parseInt(repairSpecs.spineWidth) + FLYSHEET_CHEESECLOTH_WIDTH_ADDITION,
        }
    })

    const cheeseclothHeight: MaterialHeight = await tx.materialHeight.create({
        data: {
            materialForRepairId: cheeseclothMaterialForRepair.id,
            measurement: parseInt(repairSpecs.textBlockHeight, 10) - FLYSHEET_CHEESCLOTH_HEIGHT_SUBTRACTION,
        }
    })

    // Book Ribbon 1
    const bookRibbonMaterialForRepair1: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost1,
        }
    })

    // Book Ribbon 2
    const bookRibbonMaterialForRepair2: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
            materialId: bookRibbonMaterial.id,
            amountUsed: bookRibbonMaterialUsed,
            materialCost: bookRibbonMaterialCost2,
        }
    })

    // Glue
    const glueMaterialForRepair: MaterialForRepair = await tx.materialForRepair.create({
        data: {
            repairId: coverReplacementRepair.id,
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

        // So newBook can be returned
        let newBook: Book

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
            newBook = await tx.book.create({
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

            let bookId: string = newBook.id

            for (let repair of repairForms) {

                // Paper Repair
                if (repair.repairTypeName === "Paper Repair") {
                    await createPaperRepair(tx, repair, repairSpecs, bookId)
                }

                // Tip In
                if (repair.repairTypeName === "Tip-In") {
                    await createTipinRepair(tx, repair, repairSpecs, bookId)
                }

                // Base Hinge Tightening
                if (repair.repairTypeName === "Base Hinge Tightening") {
                    await createBaseHingeRepair(tx, repair, repairSpecs, bookId)
                }

                // Spine Replacement
                if (repair.repairTypeName === "Spine Replacement") {
                    await createSpineReplacementRepair(tx, repair, repairSpecs, bookId)
                }

                // Resewing
                if (repair.repairTypeName === "Resewing") {
                    await createResewingRepair(tx, repair, repairSpecs, bookId)
                }

                // Flysheet Replacement
                if (repair.repairTypeName === "Flysheet Replacement") {
                    await createFlysheetRepair(tx, repair, repairSpecs, bookId)
                }

                // Cover Replacement
                if (repair.repairTypeName === "Cover Replacement") {
                    await createCoverRepair(tx, repair, repairSpecs, bookId)
                }
            }
        })

        let finalBook: Book = await prisma.book.findUnique({
            where: {
                id: newBook.id
            }
        })


        res.status(200).json(finalBook)
    }
}


export default handle