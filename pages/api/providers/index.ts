import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    // Define an array of providers as an array of type Provider
    type Providers = Provider[]

    if (req.method == 'GET')
    {
        const providers: Providers = await prisma.provider.findMany()
        res.json(providers)
    }
    if (req.method == 'POST')
    {
        const { providerName }: Provider = req.body
        const provider: Provider = await prisma.provider.create({
            data: {
                providerName: providerName,
            },
        })
        res.status(200).json(provider)
    }
}