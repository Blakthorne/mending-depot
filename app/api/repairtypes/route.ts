import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of repair types as an array of type RepairType
type RepairTypes = RepairType[]

export async function GET(req: NextRequest) {
    const repairTypes: RepairTypes = await prisma.repairType.findMany()
    return NextResponse.json(repairTypes)
}

export async function POST(req: NextRequest) {
    const { repairTypeName }: RepairType = await req.json()
    const repairType: RepairType = await prisma.repairType.create({
        data: {
            repairTypeName: repairTypeName,
        },
    })
    return NextResponse.json(repairType)
}