import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const materialForRepairs = await prisma.materialForRepair.findMany()
        res.json(materialForRepairs)
    }
    if (req.method == 'POST')
    {
        let { repairId, materialId, amountUsed } = req.body

        // Ensure the new entries are in the correct format
        amountUsed == '' ? amountUsed = null : amountUsed = parseFloat(amountUsed)

        const result = await prisma.materialForRepair.create({
            data: {
                repairId: repairId,
                materialId: materialId,
                amountUsed: amountUsed,
            },
        })
        res.status(200).json(result)
    }
}