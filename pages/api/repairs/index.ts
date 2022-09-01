import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    
    // Create type structure for a repair entry
    type Repair = {
        id?: string;
        repairTypeId: string;
        repairMaterialsCost: string | number | null;
        bookId: string;
    }

    // Define an array of repairs as an array of type Repair
    type Repairs = Repair[]

    if (req.method == 'GET')
    {
        const repairs: Repairs = await prisma.repair.findMany()
        res.json(repairs)
    }
    if (req.method == 'POST')
    {
        let { repairTypeId, repairMaterialsCost, bookId }: Repair = req.body

        // Ensure the new entries are in the correct format
        if (repairMaterialsCost === '') {
            repairMaterialsCost = null
        }
        else if (typeof repairMaterialsCost === "string") {
            repairMaterialsCost = parseFloat(repairMaterialsCost)
        }

        const repair: Repair = await prisma.repair.create({
            data: {
                repairTypeId: repairTypeId,
                repairMaterialsCost: repairMaterialsCost,
                bookId: bookId,
            },
        })
        res.status(200).json(repair)
    }
}