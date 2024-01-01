import prisma from '../../../../lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

type ProcessedMaterials = {
    materialName: string;
    unitTypeId: string;
    unitCost: string | number;
    manufacturerId: string;
    materialTypesInputs: string[]
}

/**
 * Create new entries in the TypesForMaterials table in a transaction
 * 
 * @param materialId 
 * @param typesArray 
 */
async function createTypesForMaterials(materialId: string, typesArray: string[]) {
    return await prisma.$transaction(async (tx: PrismaClient) => {
        for (let type of typesArray) {
            await tx.typesForMaterials.create({
                data: {
                    materialId: materialId,
                    materialTypeId: type,
                }
            })
        }
    })
}

export async function POST(req: NextRequest) {
    let { materialName, unitTypeId, unitCost, manufacturerId, materialTypesInputs }: ProcessedMaterials = await req.json()

    // Ensure the new entries are in the correct format
    if (typeof unitCost === "string") {
        unitCost = parseFloat(unitCost)
    }

    const material: Material = await prisma.material.create({
        data: {
            materialName: materialName,
            unitTypeId: unitTypeId,
            unitCost: unitCost,
            manufacturerId: manufacturerId,
        }
    })

    const typesForMaterials = await createTypesForMaterials(material.id, materialTypesInputs)
    return NextResponse.json({ material, typesForMaterials })
}