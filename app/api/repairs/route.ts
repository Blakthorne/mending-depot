import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of repairs as an array of type Repair
type Repairs = Repair[]

export async function GET(req: NextRequest) {
    const repairs: Repairs = await prisma.repair.findMany()
    return NextResponse.json(repairs)
}

export async function POST(req: NextRequest) {
    let { repairTypeId, repairMaterialsCost, bookId }: Repair = await req.json()

    // Ensure the new entries are in the correct format
    // Cannot use 'else if' on string empty checks for type checking reasons - TypeScript thinks they could still be numbers
    if (repairMaterialsCost === '') {
        repairMaterialsCost = null
    }
    if (typeof repairMaterialsCost === "string") {
        repairMaterialsCost = parseFloat(repairMaterialsCost)
    }

    const repair: Repair = await prisma.repair.create({
        data: {
            repairTypeId: repairTypeId,
            repairMaterialsCost: repairMaterialsCost,
            bookId: bookId,
        },
    })
    return NextResponse.json(repair)
}