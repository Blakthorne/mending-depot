import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    
    // Create type structure for an owner entry
    type Owner = {
        id?: string;
        ownerName: string;
    }

    const name: string  = req.query.ownerName
    const owner: Owner = await prisma.owner.findUnique({
        where: {
            ownerName: name
        }
    })
    res.json(owner)
}