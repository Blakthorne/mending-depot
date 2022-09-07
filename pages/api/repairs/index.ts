import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of repairs as an array of type Repair
    type Repairs = Repair[]

    if (req.method == 'GET')
    {
        const repairs: Repairs = await prisma.repair.findMany()
        res.json(repairs)
    }
    if (req.method == 'POST')
    {
        let { repairTypeId, repairMaterialsCost, bookId }: Repair = req.body

        // Ensure the new entries are in the correct format
        // Cannot use 'else if' on string empty checks for type checking reasons - TypeScript thinks they could still be numbers
        if (repairMaterialsCost === '') {
            repairMaterialsCost = null
        }
        if (typeof repairMaterialsCost === "string") {
            repairMaterialsCost = parseFloat(repairMaterialsCost)
        }

        const repair: Repair = await prisma.repair.create({
            data: {
                repairTypeId: repairTypeId,
                repairMaterialsCost: repairMaterialsCost,
                bookId: bookId,
            },
        })
        res.status(200).json(repair)
    }
}