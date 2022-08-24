import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const owners = await prisma.owner.findMany()
        res.json(owners)
    }
    if (req.method == 'POST')
    {
        const { ownerName } = req.body
        const result = await prisma.owner.create({
            data: {
                ownerName: ownerName,
            },
        })
        res.status(200).json(result)
    }
}