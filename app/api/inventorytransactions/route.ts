import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of inventory transactions as an array of type InventoryTransaction
type InventoryTransactions = InventoryTransaction[]

export async function GET(req: NextRequest) {
    let inventoryTransactions: InventoryTransactions = await prisma.inventoryTransaction.findMany()

    // For every inventory transaction entry in the table, reformat the date entries into the format MM - DD -YYYY
    for (let i = 0; i < inventoryTransactions.length; ++i) {
        let { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId }: InventoryTransaction = inventoryTransactions[i]

        if (datePurchased === null) datePurchased = ''
        else if (datePurchased instanceof Date) {
            datePurchased = datePurchased.toJSON()
            datePurchased = datePurchased.slice(5,7) + ' - ' + datePurchased.slice(8,10) + ' - ' + datePurchased.slice(0,4)
        }

        if (dateReceived == null) dateReceived = ''
        else if (dateReceived instanceof Date) {
            dateReceived = dateReceived.toJSON()
            dateReceived = dateReceived.slice(5,7) + ' - ' + dateReceived.slice(8,10) + ' - ' + dateReceived.slice(0,4)
        }

        const reformattedInventoryTransaction: InventoryTransaction = { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId }

        inventoryTransactions[i] = reformattedInventoryTransaction
    }

    return NextResponse.json(inventoryTransactions)
}

export async function POST(req: NextRequest) {
    let { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId }: InventoryTransaction = await req.json()

    // Ensure the new entries are in the correct format
    // Cannot use 'else if' on string empty checks for type checking reasons - TypeScript thinks they could still be numbers
    if (typeof datePurchased === "string") {
        datePurchased = new Date(parseFloat(datePurchased.slice(10)), parseFloat(datePurchased.slice(0, 2)) - 1, parseFloat(datePurchased.slice(5, 7)))
    }

    if (dateReceived === '') {
        dateReceived = null
    }
    if (typeof dateReceived === "string") {
        dateReceived = new Date(parseFloat(dateReceived.slice(10)), parseFloat(dateReceived.slice(0, 2)) - 1, parseFloat(dateReceived.slice(5, 7)))
    }

    if (typeof unitsPurchased === "string") {
        unitsPurchased = parseFloat(unitsPurchased)
    }
    
    if (transactionCost === '') {
        transactionCost = null
    }
    if (typeof transactionCost === "string") {
        transactionCost = parseFloat(transactionCost)
    }

    const inventoryTransaction: InventoryTransaction = await prisma.inventoryTransaction.create({
        data: {
            datePurchased: datePurchased,
            dateReceived: dateReceived,
            unitsPurchased: unitsPurchased,
            transactionCost: transactionCost,
            materialId: materialId,
            providerId: providerId,
        },
    })
    return NextResponse.json(inventoryTransaction)
}