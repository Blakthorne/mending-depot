import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    
    // Create type structure for a provider entry
    type Provider = {
        id?: string;
        providerName: string;
    }

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