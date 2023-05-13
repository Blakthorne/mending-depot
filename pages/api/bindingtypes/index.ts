import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of binding types as an array of type BindingType
    type BindingTypes = BindingType[]

    if (req.method == 'GET')
    {
        const bindingTypes: BindingTypes = await prisma.bindingType.findMany()
        res.json(bindingTypes)
    }
    if (req.method == 'POST')
    {
        const { bindingTypeName }: BindingType = req.body
        const bindingType: BindingType = await prisma.bindingType.create({
            data: {
                bindingTypeName: bindingTypeName,
            },
        })
        res.status(200).json(bindingType)
    }
}