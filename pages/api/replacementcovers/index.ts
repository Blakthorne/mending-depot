import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CoverType } from '@prisma/client';
import { CoverMaterial } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    
    // Create type structure for a replacement cover entry
    type ReplacementCover = {
        id?: string;
        coverType: CoverType | null;
        spineMaterial: CoverMaterial | null;
        sideMaterial: CoverMaterial | null;
        repairId: string;
    }

    // Define an array of replacement covers as an array of type ReplacementCover
    type ReplacementCovers = ReplacementCover[]

    if (req.method == 'GET')
    {
        const replacementCovers: ReplacementCovers = await prisma.replacementCover.findMany()
        res.json(replacementCovers)
    }
    if (req.method == 'POST')
    {
        let { coverType, spineMaterial, sideMaterial, repairId }: ReplacementCover = req.body

        // Ensure the new entries are in the correct format
        if (coverType in CoverType) {
            coverType = CoverType[coverType]
        }
        else {
            coverType = null
        }
        
        if (spineMaterial in CoverMaterial) {
            spineMaterial = CoverMaterial[spineMaterial]
        }
        else {
            spineMaterial = null
        }

        if (sideMaterial in CoverMaterial) {
            sideMaterial = CoverMaterial[sideMaterial]
        }
        else {
            sideMaterial = null
        }

        const replacementCover: ReplacementCover = await prisma.replacementCover.create({
            data: {
                coverType: coverType,
                spineMaterial: spineMaterial,
                sideMaterial: sideMaterial,
                repairId: repairId,
            },
        })
        res.status(200).json(replacementCover)
    }
}