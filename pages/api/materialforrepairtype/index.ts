import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of material for repairs as an array of type MaterialForRepair
    type MaterialForRepairTypes = MaterialForRepairType[]

    if (req.method == 'GET')
    {
        const materialForRepairTypes: MaterialForRepairTypes = await prisma.materialForRepairType.findMany()
        res.json(materialForRepairTypes)
    }
    if (req.method == 'POST')
    {
        let { repairTypeId, materialId }: MaterialForRepairType = req.body

        const materialforRepairType: MaterialForRepairType = await prisma.materialForRepairType.create({
            data: {
                repairTypeId: repairTypeId,
                materialId: materialId,
            },
        })
        res.status(200).json(materialforRepairType)
    }
}