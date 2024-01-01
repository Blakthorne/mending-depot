import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

type Pair = {
    materialTypeName: string;
    materialTypeId: string;
    materialName: string;
    materialId: string;
}

export async function GET(req: NextRequest) {
    
    // Pairs of materialTypeNames and materialNames for display together in a table
    let pairs: Pair[] = []

    const materialTypeMaterials = await prisma.materialType.findMany({
        select: {
            materialTypeName: true,
            id: true,
            materials: {
                select: {
                    material: {
                        select: {
                            materialName: true,
                            id: true,
                        },
                    },
                },
            },
        },
    })

    for (let materialType of materialTypeMaterials) {
        let prevMaterialType: string = ''
        for (let materialEntry of materialType.materials) {
            let materialTypeName = materialType.materialTypeName
            let materialTypeId = materialType.id
            let materialName = materialEntry.material.materialName
            let materialId = materialEntry.material.id


            pairs.push({materialTypeName, materialTypeId, materialName, materialId})

            prevMaterialType = materialType.materialTypeName
        }
    }

    return NextResponse.json(pairs)
}