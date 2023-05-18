import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST')
    {
        let { repairForms, repairSpecs } = req.body

        
    }
}