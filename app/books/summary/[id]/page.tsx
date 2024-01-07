import { Metadata } from 'next'
import LoadingIcon from '../../../loading'
import Link from 'next/link';

type MaterialData = {
    materialForRepair: MaterialForRepair;
    material: Material;
    unitType: UnitType;
    materialHeight: MaterialHeight;
    materialWidth: MaterialWidth;
}

type RepairData = {
    repair: Repair;
    repairType: RepairType;
    materialData: MaterialData[];
}

// Define a format to return to the client
type SummaryData = {
    book: Book;
    owner: Owner;
    bindingType: BindingType;
    repairData: RepairData[];
}

async function getData(bookId: string) {
    const res = await fetch(process.env.URL + '/api/summary/' + bookId, { cache: 'no-store' } )
    const summary = await res.json()

    return summary
}

export async function generateMetadata(
    { params }: { params: { id: string } }
    ): Promise<Metadata> {
   
    // fetch data
    const book: Book = await fetch(process.env.URL + "/api/books/" + params.id).then((res) => res.json())

    return {
    title: "'" + book.title + "' Summary",
    description: "Summary of '" + book.title + "'"
    }
}

/**
 * 
 * @param {string} bookId The specified book id
 * @returns HTML summary of the book repairs
 */
export default async function BookSummary({ params }: { params: { id: string } }) {

    const data: SummaryData = await getData(params.id)
    if (!data) {
        return (
            <LoadingIcon/>
        )
    }

    if (data.book.received instanceof Date) {
        data.book.received = data.book.received.toString()
    }

    if (data.book.returned instanceof Date) {
        data.book.returned = data.book.returned.toString()
    }

    // Ensure these vars are of type `number` for profit calculation
    if (typeof data.book.amountCharged === "string") {
        data.book.amountCharged = parseFloat(data.book.amountCharged)
    }
    if (typeof data.book.bookMaterialsCost === "string") {
        data.book.bookMaterialsCost = parseFloat(data.book.bookMaterialsCost)
    }

    const profit: number = data.book.amountCharged - data.book.bookMaterialsCost

    let iterKey: number = 0
    
    return (
        <div className="flex flex-col min-h-screen mb-4">
            <div className="flex place-self-end gap-x-4 mr-16">
                <Link className="btn btn-outline"
                      href={"/books/edit/" + data.book.id}>Edit</Link>
                <Link className="btn btn-outline"
                      href={"/books/repairs/" + data.book.id}>Add Repair</Link>
            </div>
            <div className="font-sans text-8xl text-center tracking-wide mb-16 mx-4">
                {data.book.title}
            </div>
            <div className="flex flex-col justify-center mx-auto gap-y-16">
                <div className="stats stats-vertical lg:stats-horizontal bg-neutral text-neutral-content shadow">
                    <div className="stat">
                        <div className="stat-title text-neutral-content/75">Owner</div>
                        <div className="stat-value">{data.owner.ownerName}</div>
                    </div>
                    
                    <div className="stat">
                        <div className="stat-title text-neutral-content/75">Status</div>
                        <div className="stat-value">{data.book.returned ? "Complete!" : "Incomplete"}</div>
                    </div>
                    
                    <div className="stat">
                        <div className="stat-title text-neutral-content/75">Author</div>
                        <div className="stat-value">{data.book.author}</div>
                    </div>
                </div>
                <div className="stats stats-vertical lg:stats-horizontal bg-neutral text-neutral-content shadow">
                    <div className="stat">
                        <div className="stat-title text-neutral-content/75">Materials Cost</div>
                        <div className="stat-value">{data.book.bookMaterialsCost === null ? "N/A" : "$" + data.book.bookMaterialsCost}</div>
                    </div>
                    
                    <div className="stat">
                        <div className="stat-title text-neutral-content/75">Amount Charged</div>
                        <div className="stat-value">{data.book.amountCharged === null ? "N/A" : "$" + data.book.amountCharged}</div>
                    </div>
                    
                    <div className="stat">
                        <div className="stat-title text-neutral-content/75">Profit</div>
                        <div className="stat-value">{data.book.amountCharged === null ? "N/A" : "$" + profit}</div>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto mx-auto mt-16">
                <table className="table table-zebra border-2 border-base-300">
                    <tbody>
                        <tr>
                            <td>Publisher</td>
                            <td>{data.book.publisher}</td>
                        </tr>
                        <tr>
                            <td>Year Published</td>
                            <td>{data.book.yearPublished}</td>
                        </tr>
                        <tr>
                            <td>Number of Pages</td>
                            <td>{data.book.numberOfPages}</td>
                        </tr>
                        <tr>
                            <td>Binding Type</td>
                            <td>{data.bindingType.bindingTypeName}</td>
                        </tr>
                        <tr>
                            <td>Book ID</td>
                            <td>{data.book.id}</td>
                        </tr>
                        <tr>
                            <td>Date Received</td>
                            <td>{data.book.received}</td>
                        </tr>
                        <tr>
                            <td>Date Returned</td>
                            <td>{data.book.returned}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="font-sans mx-auto w-full">
                {data.repairData.map(repair => (
                    <div key={(iterKey += 1)} className="mt-16">
                        <div key={(iterKey += 1)} className="text-center mb-8">
                            <div key={repair.repairType.repairTypeName + (iterKey += 1).toString()} className="font-medium tracking-wide text-5xl mb-4 mx-2">{repair.repairType.repairTypeName}</div>
                            <div key={repair.repair.repairMaterialsCost + (iterKey += 1).toString()} className="text-2xl text-base-content/75 font-light">${repair.repair.repairMaterialsCost}</div>
                        </div>
                        <div key={(iterKey += 1)} className="flex flex-wrap justify-center mx-4 gap-x-6 gap-y-8">
                            {repair.materialData
                                .sort((a,b) => (a.material.materialName.toLowerCase() > b.material.materialName.toLowerCase()) ? 1 : ((b.material.materialName.toLowerCase() > a.material.materialName.toLowerCase()) ? -1 : 0))
                                .map(material => (
                                <div key={(iterKey += 1)} className="card w-96 shadow-md bg-base-300">
                                    <div key={(iterKey += 1)} className="card-body">
                                        <div key={material.material.materialName + (iterKey += 1).toString()} className="card-title">{material.material.materialName}</div>
                                        {material.materialHeight ?
                                        <div key={material.materialForRepair.amountUsed + (iterKey += 1).toString()} className="">{material.materialWidth.measurement} x {material.materialHeight.measurement} {material.unitType.unitTypeName}</div>
                                        :
                                        <div key={material.materialForRepair.amountUsed + (iterKey += 1).toString()} className="">{material.materialForRepair.amountUsed} {material.materialForRepair.amountUsed === 1 ? material.unitType.unitTypeName.slice(0, -1) : material.unitType.unitTypeName}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}