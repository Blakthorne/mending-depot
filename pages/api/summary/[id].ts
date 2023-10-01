import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        // const repairTypes: RepairTypes = await prisma.repairType.findMany()
        const { id } = req.query
        res.status(200).json(id)
    }
}