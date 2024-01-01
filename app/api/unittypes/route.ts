import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of unit types as an array of type UnitType
type UnitTypes = UnitType[]

export async function GET(req: NextRequest) {
    const unitTypes: UnitTypes = await prisma.unitType.findMany()
    return NextResponse.json(unitTypes)
}

export async function POST(req: NextRequest) {
    const { unitTypeName }: UnitType = await req.json()
    const unitType: UnitType = await prisma.unitType.create({
        data: {
            unitTypeName: unitTypeName,
        },
    })
    return NextResponse.json(unitType)
}