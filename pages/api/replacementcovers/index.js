import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const replacementCovers = await prisma.replacementCover.findMany()
        res.json(replacementCovers)
    }
    if (req.method == 'POST')
    {
        let { coverType, spineMaterial, sideMaterial, repairId } = req.body

        // Ensure the new entries are in the correct format
        if (coverType == '') coverType = null
        if (spineMaterial == '') spineMaterial = null
        if (sideMaterial == '') sideMaterial = null

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