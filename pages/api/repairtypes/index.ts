import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    
    // Create type structure for a repair type entry
    type RepairType = {
        id?: string;
        repairTypeName: string;
    }

    // Define an array of repair types as an array of type RepairType
    type RepairTypes = RepairType[]

    if (req.method == 'GET')
    {
        const repairTypes: RepairTypes = await prisma.repairType.findMany()
        res.json(repairTypes)
    }
    if (req.method == 'POST')
    {
        const { repairTypeName }: RepairType = req.body
        const repairType: RepairType = await prisma.repairType.create({
            data: {
                repairTypeName: repairTypeName,
            },
        })
        res.status(200).json(repairType)
    }
}