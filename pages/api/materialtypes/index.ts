import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of material types as an array of type MaterialType
    type MaterialTypes = MaterialType[]

    if (req.method == 'GET')
    {
        const materialTypes: MaterialTypes = await prisma.materialType.findMany()
        res.json(materialTypes)
    }
    if (req.method == 'POST')
    {
        const { materialTypeName }: MaterialType = req.body
        const materialType: MaterialType = await prisma.materialType.create({
            data: {
                materialTypeName: materialTypeName,
            },
        })
        res.status(200).json(materialType)
    }
}