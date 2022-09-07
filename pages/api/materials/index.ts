import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Unit } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of materials as an array of type Material
    type Materials = Material[]

    if (req.method == 'GET')
    {
        const materials: Materials = await prisma.material.findMany()
        res.json(materials)
    }
    if (req.method == 'POST')
    {
        let { materialName, units, unitCost, manufacturerId }: Material = req.body

        // Ensure the new entries are in the correct format
        units = Unit[units]

        if (typeof unitCost === "string") {
            unitCost = parseFloat(unitCost)
        }

        const material: Material = await prisma.material.create({
            data: {
                materialName: materialName,
                units: units,
                unitCost: unitCost,
                manufacturerId: manufacturerId,
            },
        })
        res.status(200).json(material)
    }
}