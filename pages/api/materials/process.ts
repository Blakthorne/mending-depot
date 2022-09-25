import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

/**
 * Create new entries in the materialForRepairType table in a transaction
 * 
 * @param materialId 
 * @param repairsArray 
 */
async function createMaterialForRepairType(materialId: string, repairsArray: string[]) {
    return await prisma.$transaction(async (tx: PrismaClient) => {
        for (let repair of repairsArray) {
            await tx.materialForRepairType.create({
                data: {
                    repairTypeId: repair,
                    materialId: materialId,
                }
            })
        }
    })
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST')
    {
        let { materialName, units, unitCost, manufacturerId, repairTypesInputs } = req.body

        // Ensure the new entries are in the correct format
        if (typeof unitCost === "string") {
            unitCost = parseFloat(unitCost)
        }

        const material: Material = await prisma.material.create({
            data: {
                materialName: materialName,
                units: units,
                unitCost: unitCost,
                manufacturerId: manufacturerId,
            }
        })

        const materialForRepairTypes = await createMaterialForRepairType(material.id, repairTypesInputs)
        res.status(200).json({ material, materialForRepairTypes })
    }
}