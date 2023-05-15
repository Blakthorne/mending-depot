import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of unit types as an array of type UnitType
    type UnitTypes = UnitType[]

    if (req.method == 'GET')
    {
        const unitTypes: UnitTypes = await prisma.unitType.findMany()
        res.json(unitTypes)
    }
    if (req.method == 'POST')
    {
        const { unitTypeName }: UnitType = req.body
        const unitType: UnitType = await prisma.unitType.create({
            data: {
                unitTypeName: unitTypeName,
            },
        })
        res.status(200).json(unitType)
    }
}