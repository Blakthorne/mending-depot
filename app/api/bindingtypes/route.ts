import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of binding types as an array of type BindingType
type BindingTypes = BindingType[]

export async function GET(req: NextRequest) {
    const bindingTypes: BindingTypes = await prisma.bindingType.findMany()
    return NextResponse.json(bindingTypes)
}

export async function POST(req: NextRequest) {
    const { bindingTypeName }: BindingType = await req.json()
    const bindingType: BindingType = await prisma.bindingType.create({
        data: {
            bindingTypeName: bindingTypeName,
        },
    })
    return NextResponse.json(bindingType)
}