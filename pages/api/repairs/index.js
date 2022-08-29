import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const repairs = await prisma.repair.findMany()
        res.json(repairs)
    }
    if (req.method == 'POST')
    {
        let { repairType, repairMaterialsCost, bookId } = req.body

        // Ensure the new entries are in the correct format
        repairMaterialsCost == '' ? repairMaterialsCost = null : repairMaterialsCost = parseFloat(repairMaterialsCost)

        const result = await prisma.repair.create({
            data: {
                repairType: repairType,
                repairMaterialsCost: repairMaterialsCost,
                bookId: bookId,
            },
        })
        res.status(200).json(result)
    }
}