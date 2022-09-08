import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of replacement covers as an array of type ReplacementCover
    type ReplacementCovers = ReplacementCover[]

    if (req.method == 'GET')
    {
        const replacementCovers: ReplacementCovers = await prisma.replacementCover.findMany()
        res.json(replacementCovers)
    }
    if (req.method == 'POST')
    {
        const { coverType, spineMaterial, sideMaterial, repairId }: ReplacementCover = req.body

        const replacementCover: ReplacementCover = await prisma.replacementCover.create({
            data: {
                coverType: coverType,
                spineMaterial: spineMaterial,
                sideMaterial: sideMaterial,
                repairId: repairId,
            },
        })
        res.status(200).json(replacementCover)
    }
}