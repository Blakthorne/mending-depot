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
    newType: string;
    newMaterial: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET')
    {

        // Pairs of repairTypeNames and materialNames for display together in a table
        let pairs: Pair[] = []

        const repairTypeMaterials = await prisma.repairType.findMany({
            select: {
                repairTypeName: true,
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

        for (let repairType of repairTypeMaterials) {
            let prevRepairType: string = ''
            for (let materialEntry of repairType.materials) {
                let newType: string

                // Only print out a new repairTypeName if it is different from the one previous
                // This makes the table a lot cleaner and readable
                if (repairType.repairTypeName !== prevRepairType) {
                    newType = repairType.repairTypeName
                }
                else newType = ''

                let newMaterial = materialEntry.material.materialName

                pairs.push({newType, newMaterial})

                prevRepairType = repairType.repairTypeName
            }
        }

        res.json(pairs)
    }
}