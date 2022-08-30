import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const manufacturers = await prisma.manufacturer.findMany()
        res.json(manufacturers)
    }
    if (req.method == 'POST')
    {
        const { manufacturerName } = req.body
        const result = await prisma.manufacturer.create({
            data: {
                manufacturerName: manufacturerName,
            },
        })
        res.status(200).json(result)
    }
}