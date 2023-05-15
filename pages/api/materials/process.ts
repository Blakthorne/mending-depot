import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

/**
 * Create new entries in the TypesForMaterials table in a transaction
 * 
 * @param materialId 
 * @param typesArray 
 */
async function createTypesForMaterials(materialId: string, typesArray: string[]) {
    return await prisma.$transaction(async (tx: PrismaClient) => {
        for (let type of typesArray) {
            await tx.typesForMaterials.create({
                data: {
                    materialId: materialId,
                    materialTypeId: type,
                }
            })
        }
    })
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    type ProcessedMaterials = {
        materialName: string;
        unitTypeId: string;
        unitCost: string | number;
        manufacturerId: string;
        materialTypesInputs: string[]
    }

    if (req.method == 'POST')
    {
        let { materialName, unitTypeId, unitCost, manufacturerId, materialTypesInputs }: ProcessedMaterials = req.body

        // Ensure the new entries are in the correct format
        if (typeof unitCost === "string") {
            unitCost = parseFloat(unitCost)
        }

        const material: Material = await prisma.material.create({
            data: {
                materialName: materialName,
                unitTypeId: unitTypeId,
                unitCost: unitCost,
                manufacturerId: manufacturerId,
            }
        })

        const typesForMaterials = await createTypesForMaterials(material.id, materialTypesInputs)
        res.status(200).json({ material, typesForMaterials })
    }
}