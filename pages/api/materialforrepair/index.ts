import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of material for repairs as an array of type MaterialForRepair
    type MaterialForRepairs = MaterialForRepair[]

    if (req.method == 'GET')
    {
        const materialForRepairs: MaterialForRepairs = await prisma.materialForRepair.findMany()
        res.json(materialForRepairs)
    }
    if (req.method == 'POST')
    {
        let { repairId, materialId, amountUsed }: MaterialForRepair = req.body

        // Ensure the new entries are in the correct format
        if (typeof amountUsed === "string") {
            amountUsed = parseFloat(amountUsed)
        }

        const materialforRepair: MaterialForRepair = await prisma.materialForRepair.create({
            data: {
                repairId: repairId,
                materialId: materialId,
                amountUsed: amountUsed,
            },
        })
        res.status(200).json(materialforRepair)
    }
}