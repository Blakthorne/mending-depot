import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET')
    {
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
        res.json(repairTypeMaterials)
    }
}