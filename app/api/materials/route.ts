import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of materials as an array of type Material
type Materials = Material[]

export async function GET(req: NextRequest) {
    const materials: Materials = await prisma.material.findMany()
    return NextResponse.json(materials)
}

export async function POST(req: NextRequest) {
    let { materialName, unitTypeId, unitCost, manufacturerId }: Material = await req.json()

    // Ensure the new entries are in the correct format
    if (typeof unitCost === "string") {
        unitCost = parseFloat(unitCost)
    }

    const material: Material = await prisma.material.create({
        data: {
            materialName: materialName,
            unitTypeId: unitTypeId,
            unitCost: unitCost,
            manufacturerId: manufacturerId,
        },
    })
    return NextResponse.json(material)
}