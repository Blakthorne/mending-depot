import prisma from '../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Define an array of providers as an array of type Provider
type Providers = Provider[]

export async function GET(req: NextRequest) {
    const providers: Providers = await prisma.provider.findMany()
    return NextResponse.json(providers)
}

export async function POST(req: NextRequest) {
    const { providerName }: Provider = await req.json()
    const provider: Provider = await prisma.provider.create({
        data: {
            providerName: providerName,
        },
    })
    return NextResponse.json(provider)
}