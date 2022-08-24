import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    const owners = await prisma.owner.findMany()
    res.json(owners)
    // const { ownerId, ownerName } = req.body
    // const result = await prisma.owner.create({
    //     data: {
    //         ownerId: ownerId,
    //         ownerName: ownerName,
    //     },
    // })
    // res.status(200).json(result)
}