import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
    const books = await prisma.book.findMany()
    res.json(books)
}