import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of material types as an array of type MaterialType
type MaterialTypes = MaterialType[]

export async function GET(req: NextRequest) {
    const materialTypes: MaterialTypes = await prisma.materialType.findMany()
    return NextResponse.json(materialTypes)
}

export async function POST(req: NextRequest) {
    const { materialTypeName }: MaterialType = await req.json()
    const materialType: MaterialType = await prisma.materialType.create({
        data: {
            materialTypeName: materialTypeName,
        },
    })
    return NextResponse.json(materialType)
}