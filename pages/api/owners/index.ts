import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    
    // Create type structure for an owner entry
    type Owner = {
        id?: string;
        ownerName: string;
    }

    // Define an array of owners as an array of type Owner
    type Owners = Owner[]

    if (req.method == 'GET')
    {
        const owners: Owners = await prisma.owner.findMany()
        res.json(owners)
    }
    if (req.method == 'POST')
    {
        const { ownerName }: Owner = req.body
        const owner: Owner = await prisma.owner.create({
            data: {
                ownerName: ownerName,
            },
        })
        res.status(200).json(owner)
    }
}