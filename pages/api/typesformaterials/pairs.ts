import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// Create types for organizing and accessing data from the api
type MaterialNameEntry = {
    materialName: string;
}

type MaterialEntry = {
    material: MaterialNameEntry;
}

type DataEntry = {
    materialTypeName: string;
    materials: MaterialEntry[];
}

type Pair = {
    materialTypeName: string;
    materialTypeId: string;
    materialName: string;
    materialId: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET')
    {

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

        res.json(pairs)
    }
}