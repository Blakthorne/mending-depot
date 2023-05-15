import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of types for materials as an array of type TypeForMaterial
    type TypeForMaterials = TypeForMaterial[]

    if (req.method == 'GET')
    {
        const typeForMaterials: TypeForMaterials = await prisma.typesForMaterials.findMany()
        res.json(typeForMaterials)
    }
    if (req.method == 'POST')
    {
        let { materialId, materialTypeId }: TypeForMaterial = req.body

        const typesForMaterials: TypeForMaterial = await prisma.typesForMaterials.create({
            data: {
                materialId: materialId,
                materialTypeId: materialTypeId,
            },
        })
        res.status(200).json(typesForMaterials)
    }
}