import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const replacementCovers = await prisma.replacementCover.findMany()
        res.json(replacementCovers)
    }
    if (req.method == 'POST')
    {
        const { coverType, spineMaterial, sideMaterial, repairId } = req.body
        const result = await prisma.replacementCover.create({
            data: {
                coverType: coverType,
                spineMaterial: spineMaterial,
                sideMaterial: sideMaterial,
                repairId: repairId,
            },
        })
        res.status(200).json(result)
    }
}