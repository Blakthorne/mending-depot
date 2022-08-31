import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const repairTypes = await prisma.repairType.findMany()
        res.json(repairTypes)
    }
    if (req.method == 'POST')
    {
        const { repairTypeName } = req.body
        const result = await prisma.repairType.create({
            data: {
                repairTypeName: repairTypeName,
            },
        })
        res.status(200).json(result)
    }
}