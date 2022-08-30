import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const materials = await prisma.material.findMany()
        res.json(materials)
    }
    if (req.method == 'POST')
    {
        let { materialName, units, unitCost, manufacturerId } = req.body

        // Ensure the new entries are in the correct format
        unitCost == '' ? unitCost = null : unitCost = parseFloat(unitCost)

        const result = await prisma.material.create({
            data: {
                materialName: materialName,
                units: units,
                unitCost: unitCost,
                manufacturerId: manufacturerId,
            },
        })
        res.status(200).json(result)
    }
}