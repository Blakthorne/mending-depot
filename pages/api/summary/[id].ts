import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import RepairTypes from '../../repair-types'

// Define an array of repairs as an array of type Repair
type Repairs = Repair[]

// Define an array of materialForRepairs as an array of type MaterialForRepair
type MaterialForRepairs = MaterialForRepair[]

// Define an array of materials as an array of type Material
type Materials = Material[]

// Define a format to return to the client
type SummaryInfo = {
    book: Book;
    owner: string;
    bindingType: string;
    repairs: Repair[]

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
 * 
 * @param req 
 * @param res 
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        
        // Get id of requested book
        const bookId = req.query.id as string

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

        // Retrieve just the string value
        let ownerName: string = owner.ownerName

        // Pull binding type name from table
        let bindingType: BindingType = await prisma.bindingType.findUnique({
            where: {
                id: book.bindingTypeId
            },
            select: {
                bindingTypeName: true,
            },
        })

        // Retrieve just the string value
        let bindingTypeName: string = bindingType.bindingTypeName

        // Pull all repairs from table for the book
        let repairs: Repairs = await prisma.repair.findMany({
            where: {
                bookId: bookId
            }
        })

        let repairsWithMaterials = []

        for (let repair of repairs) {
            // Retrieve name of repair type
            let repairType: RepairType = await prisma.repairType.findUnique({
                where: {
                    id: repair.repairTypeId
                },
                select: {
                    repairTypeName: true,
                },
            })

            // Retrieve just the string value
            let repairTypeName: string = repairType.repairTypeName

            let materialForRepairs: MaterialForRepairs = await prisma.materialForRepair.findMany({
                where: {
                    repairId: repair.id
                }
            })

            for (let materialForRepair of materialForRepairs) {
                let materials: Materials = await prisma.material.findMany({
                    where: {
                        id: materialForRepair.id
                    }
                })

                // Retrieve material height entry
                let materialHeight: MaterialHeight = await prisma.materialHeight.findUnique({
                    where: {
                        materialForRepairId: materialForRepair.id
                    },
                })

                // Ensure material height is a number
                if (typeof materialHeight.measurement === "string") {
                    materialHeight.measurement = parseInt(materialHeight.measurement, 10)
                }

                // Retrieve material width entry
                let materialWidth: MaterialWidth = await prisma.materialWidth.findUnique({
                    where: {
                        materialForRepairId: materialForRepair.id
                    },
                })

                // Ensure material width is a number
                if (typeof materialWidth.measurement === "string") {
                    materialWidth.measurement = parseInt(materialWidth.measurement, 10)
                }

                for (let material of materials) {
                    // Retrieve name of unit type
                    let unitType: UnitType = await prisma.unitType.findUnique({
                        where: {
                            id: material.unitTypeId
                        },
                        select: {
                            unitTypeName: true,
                        },
                    })

                    // Retrieve just the string value
                    let unitTypeName: string = unitType.unitTypeName
                }
            }

            repairsWithMaterials.push(materialForRepairs)
        }
        
        res.status(200).json(bindingTypeName)
    }
}