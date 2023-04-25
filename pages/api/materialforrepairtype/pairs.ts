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
    repairTypeName: string;
    materials: MaterialEntry[];
}

type Pair = {
    repairTypeName: string;
    repairTypeId: string;
    materialName: string;
    materialId: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET')
    {

        // Pairs of repairTypeNames and materialNames for display together in a table
        let pairs: Pair[] = []

        const repairTypeMaterials = await prisma.repairType.findMany({
            select: {
                repairTypeName: true,
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

        for (let repairType of repairTypeMaterials) {
            let prevRepairType: string = ''
            for (let materialEntry of repairType.materials) {
                let repairTypeName = repairType.repairTypeName
                let repairTypeId = repairType.id
                let materialName = materialEntry.material.materialName
                let materialId = materialEntry.material.id


                pairs.push({repairTypeName, repairTypeId, materialName, materialId})

                prevRepairType = repairType.repairTypeName
            }
        }

        res.json(pairs)
    }
}