import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        const providers = await prisma.provider.findMany()
        res.json(providers)
    }
    if (req.method == 'POST')
    {
        const { providerName } = req.body
        const result = await prisma.provider.create({
            data: {
                providerName: providerName,
            },
        })
        res.status(200).json(result)
    }
}