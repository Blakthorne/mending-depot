import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

// Create types for organizing and accessing data from the api
type Pair = {
    materialTypeName: string;
    materialName: string;
}

export async function GET(req: NextRequest) {

    // Pairs of materialTypeNames and materialNames for display together in a table
    let pairs: Pair[] = []

    const materialTypeMaterials = await prisma.materialType.findMany({
        select: {
            materialTypeName: true,
            materials: {
                select: {
                    material: {
                        select: {
                            materialName: true,
                        },
                    },
                },
            },
        },
    })

    for (let materialType of materialTypeMaterials) {
        let prevMaterialType: string = ''
        for (let materialEntry of materialType.materials) {
            let materialTypeName: string

            // Only print out a new materialTypeName if it is different from the one previous
            // This makes the table a lot cleaner and readable
            if (materialType.materialTypeName !== prevMaterialType) {
                materialTypeName = materialType.materialTypeName
            }
            else materialTypeName = ''

            let materialName = materialEntry.material.materialName

            pairs.push({materialTypeName, materialName})

            prevMaterialType = materialType.materialTypeName
        }
    }

    return NextResponse.json(pairs)
}