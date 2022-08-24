import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    const name  = req.query.ownerName
    const owner = await prisma.owner.findUnique({
        where: {
            ownerName: name
        }
    })
    res.json(owner)
}