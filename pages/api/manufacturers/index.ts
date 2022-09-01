import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    
    // Create type structure for a manufacturer entry
    type Manufacturer = {
        id?: string;
        manufacturerName: string;
    }

    // Define an array of manufacturers as an array of type Manufacturer
    type Manufacturers = Manufacturer[]

    if (req.method == 'GET')
    {
        const manufacturers: Manufacturers = await prisma.manufacturer.findMany()
        res.json(manufacturers)
    }
    if (req.method == 'POST')
    {
        const { manufacturerName }: Manufacturer = req.body
        const manufacturer: Manufacturer = await prisma.manufacturer.create({
            data: {
                manufacturerName: manufacturerName,
            },
        })
        res.status(200).json(manufacturer)
    }
}