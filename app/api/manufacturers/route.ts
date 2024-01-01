import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of manufacturers as an array of type Manufacturer
type Manufacturers = Manufacturer[]

export async function GET(req: NextRequest) {
    const manufacturers: Manufacturers = await prisma.manufacturer.findMany()
    return NextResponse.json(manufacturers)
}

export async function POST(req: NextRequest) {
    const { manufacturerName }: Manufacturer = await req.json()
    const manufacturer: Manufacturer = await prisma.manufacturer.create({
        data: {
            manufacturerName: manufacturerName,
        },
    })
    return NextResponse.json(manufacturer)
}