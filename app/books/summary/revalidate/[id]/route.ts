import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: {params: { id: string } } ) {
    revalidatePath("/books/summary/" + params.id)
    return NextResponse.json({})
}