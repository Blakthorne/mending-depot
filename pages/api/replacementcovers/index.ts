import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    
    // Create type structure for a replacement cover entry
    type ReplacementCover = {
        id?: string;
        coverType: string | null;
        spineMaterial: string | null;
        sideMaterial: string | null;
        repairId: string;
    }

    // Define an array of replacement covers as an array of type ReplacementCover
    type ReplacementCovers = ReplacementCover[]

    if (req.method == 'GET')
    {
        const replacementCovers: ReplacementCovers = await prisma.replacementCover.findMany()
        res.json(replacementCovers)
    }
    if (req.method == 'POST')
    {
        let { coverType, spineMaterial, sideMaterial, repairId }: ReplacementCover = req.body

        // Ensure the new entries are in the correct format
        if (coverType === '') coverType = null
        if (spineMaterial === '') spineMaterial = null
        if (sideMaterial === '') sideMaterial = null

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