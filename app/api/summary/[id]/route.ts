import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of repairs as an array of type Repair
type Repairs = Repair[]

// Define an array of materialForRepairs as an array of type MaterialForRepair
type MaterialForRepairs = MaterialForRepair[]

type MaterialData = {
    materialForRepair: MaterialForRepair;
    material: Material;
    unitType: UnitType;
    materialHeight?: MaterialHeight;
    materialWidth?: MaterialWidth;
}

type RepairData = {
    repair: Repair;
    repairType: RepairType;
    materialData: MaterialData[];
}

// Define a format to return to the client
type SummaryData = {
    book: Book;
    owner: Owner;
    bindingType: BindingType;
    repairData: RepairData[];
}

// Format the received and returned dates of the Book to be readable
function FormatDates(book): Book {
    let { id, title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }: Book = book

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

    const reformattedBook: Book = { id, title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }

    return reformattedBook
}

/**
 * Return a JSON object with the format:
 *      Book Entry Object
 *      Owner Name
 *      Binding Type
 *      Repair Data
 */
export async function GET(req: NextRequest, { params }: {params: { id: string } } ) {
    // Get id of requested book
    const bookId = params.id

    // Pull book info from table
    let nonFormattedBook: Book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })

    // Format book dates
    let book = FormatDates(nonFormattedBook)

    // Pull owner name from owner table
    let owner: Owner = await prisma.owner.findUnique({
        where: {
            id: book.ownerId
        },
        select: {
            ownerName: true,
        },
    })

    // Pull binding type name from table
    let bindingType: BindingType = await prisma.bindingType.findUnique({
        where: {
            id: book.bindingTypeId
        },
        select: {
            bindingTypeName: true,
        },
    })

    // Pull all repairs from table for the book
    let repairs: Repairs = await prisma.repair.findMany({
        where: {
            bookId: bookId
        }
    })

    let repairDatas: RepairData[] = []

    for (let repair of repairs) {

        // Retrieve name of repair type
        let repairType: RepairType = await prisma.repairType.findUnique({
            where: {
                id: repair.repairTypeId
            }
        })

        let materialForRepairs: MaterialForRepairs = await prisma.materialForRepair.findMany({
            where: {
                repairId: repair.id
            }
        })

        let materialDatas: MaterialData[] = []

        for (let materialForRepair of materialForRepairs) {

            // Retrieve material height entry
            let materialHeight: MaterialHeight = await prisma.materialHeight.findUnique({
                where: {
                    materialForRepairId: materialForRepair.id
                },
            })

            // Retrieve material width entry
            let materialWidth: MaterialWidth = await prisma.materialWidth.findUnique({
                where: {
                    materialForRepairId: materialForRepair.id
                },
            })

            let material: Material = await prisma.material.findUnique({
                where: {
                    id: materialForRepair.materialId
                }
            })

            // Retrieve name of unit type
            let unitType: UnitType = await prisma.unitType.findUnique({
                where: {
                    id: material.unitTypeId
                },
            })

            let materialData: MaterialData = {
                materialForRepair: materialForRepair,
                material: material,
                unitType: unitType,
                materialHeight: materialHeight,
                materialWidth: materialWidth,
            }

            materialDatas.push(materialData)
        }

        let repairData: RepairData = {
            repair: repair,
            repairType: repairType,
            materialData: materialDatas,
        }

        repairDatas.push(repairData)
    }

    let summaryData: SummaryData = {
        book: book,
        owner: owner,
        bindingType: bindingType,
        repairData: repairDatas,
    }

    return NextResponse.json(summaryData)
}