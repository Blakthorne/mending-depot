import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

    // Create type structure for a material entry
    type Material = {
        id?: string;
        materialName: string;
        units: string;
        unitCost: string | number;
        manufacturerId: string;
    }

    // Define an array of materials as an array of type Material
    type Materials = Material[]

    if (req.method == 'GET')
    {
        const materials: Materials = await prisma.material.findMany()
        res.json(materials)
    }
    if (req.method == 'POST')
    {
        let { materialName, units, unitCost, manufacturerId }: Material = req.body

        // Ensure the new entries are in the correct format
        if (typeof unitCost === "string") {
            unitCost = parseFloat(unitCost)
        }

        const material: Material = await prisma.material.create({
            data: {
                materialName: materialName,
                units: units,
                unitCost: unitCost,
                manufacturerId: manufacturerId,
            },
        })
        res.status(200).json(material)
    }
}