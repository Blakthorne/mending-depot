import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    if (req.method == 'GET')
    {
        let inventoryTransactions = await prisma.inventoryTransaction.findMany()

        // For every book entry in the table, reformat the date entries into the format MM - DD -YYYY
        for (let i = 0; i < inventoryTransactions.length; ++i) {
            let { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId } = inventoryTransactions[i]

            if (datePurchased == null) datePurchased = ''
            else {
                datePurchased = datePurchased.toJSON()
                datePurchased = datePurchased.slice(5,7) + ' - ' + datePurchased.slice(8,10) + ' - ' + datePurchased.slice(0,4)
            }

            if (dateReceived == null) dateReceived = ''
            else {
                dateReceived = dateReceived.toJSON()
                dateReceived = dateReceived.slice(5,7) + ' - ' + dateReceived.slice(8,10) + ' - ' + dateReceived.slice(0,4)
            }

            inventoryTransactions[i] = { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId }
        }

        res.json(inventoryTransactions)
    }
    if (req.method == 'POST')
    {
        let { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId } = req.body

        // Ensure the new entries are in the correct format
        let datePurchasedDate = new Date(datePurchased.slice(10), datePurchased.slice(0, 2), datePurchased.slice(5, 7))
        let dateReceivedDate = null
        dateReceived == '' ? dateReceived = null : dateReceivedDate = new Date(dateReceived.slice(10), dateReceived.slice(0, 2), dateReceived.slice(5, 7))
        unitsPurchased = parseFloat(unitsPurchased)
        transactionCost == '' ? transactionCost = null : transactionCost = parseFloat(transactionCost)

        const result = await prisma.material.create({
            data: {
                datePurchased: datePurchasedDate,
                dateReceived: dateReceivedDate,
                unitsPurchased: unitsPurchased,
                transactionCost: transactionCost,
                materialId: materialId,
                providerId: providerId,
            },
        })
        res.status(200).json(result)
    }
}