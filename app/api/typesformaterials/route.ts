import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of types for materials as an array of type TypeForMaterial
type TypeForMaterials = TypeForMaterial[]

export async function GET(req: NextRequest) {
    const typeForMaterials: TypeForMaterials = await prisma.typesForMaterials.findMany()
    return NextResponse.json(typeForMaterials)
}

export async function POST(req: NextRequest) {
    let { materialId, materialTypeId }: TypeForMaterial = await req.json()

    const typesForMaterials: TypeForMaterial = await prisma.typesForMaterials.create({
        data: {
            materialId: materialId,
            materialTypeId: materialTypeId,
        },
    })
    return NextResponse.json(typesForMaterials)
}