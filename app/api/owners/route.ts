import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of owners as an array of type Owner
type Owners = Owner[]

export async function GET(req: NextRequest) {
    const owners: Owners = await prisma.owner.findMany()
    return NextResponse.json(owners)
}

export async function POST(req: NextRequest) {
    const { ownerName }: Owner = await req.json()
    const owner: Owner = await prisma.owner.create({
        data: {
            ownerName: ownerName,
        },
    })
    return NextResponse.json(owner)
}