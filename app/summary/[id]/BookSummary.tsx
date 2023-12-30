'use client'
import useSWR from 'swr'

type SummaryComponent = {
    bookId: string
}

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

/**
 * 
 * @param {string} bookId The specified book id
 * @returns HTML summary of the book repairs
 */
export default function BookSummary({ bookId }: SummaryComponent) {

    if (bookId === undefined) {
        bookId = ""
    }

    // Retrieve the table requested by the parent component
    const { data, error } = useSWR<SummaryData, Error>('/api/summary/' + bookId)
    if (error) console.log(error)
    if (!data) {
        return (
            <span className="loading loading-infinity loading-lg text-info"></span>
        )
    }

    if (data.book.received instanceof Date) {
        data.book.received = data.book.received.toString()
    }

    if (data.book.returned instanceof Date) {
        data.book.returned = data.book.returned.toString()
    }

    let iterKey: number = 0
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="font-sans text-8xl text-center tracking-wide mb-6">
                {data.book.title}
            </div>
            <div className="font-sans text-xl text-center mb-2">
                Owned by {data.owner.ownerName}
            </div>
            <div className="font-sans text-xl text-center">
                {data.book.returned ? "Completed!" : "Incomplete"}
            </div>
            <div className="table border-collapse table-auto text-sm mt-8 mb-10 mx-auto">
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Author</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.author}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Publisher</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.publisher}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Year Published</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.yearPublished}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Number of Pages</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.numberOfPages}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Binding Type</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.bindingType.bindingTypeName}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Book ID</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.id}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Date Received</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.received}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-right">Date Returned</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.returned}</div>
                </div>
            </div>
            <div>
                <div className="font-sans text-xl text-center mb-2">
                    Total Cost of Materials - {data.book.bookMaterialsCost}
                </div>
                <div className="font-sans text-xl text-center">
                    
                </div>
            </div>
            <div className="font-sans mx-auto w-full">
                {data.repairData.map(repair => (
                    <div key={(iterKey += 1)} className="mt-16">
                        <div key={(iterKey += 1)} className="text-center mb-8">
                            <div key={repair.repairType.repairTypeName + (iterKey += 1).toString()} className="font-medium tracking-wide text-5xl mb-4">{repair.repairType.repairTypeName}</div>
                            <div key={repair.repair.repairMaterialsCost + (iterKey += 1).toString()} className="text-2xl">${repair.repair.repairMaterialsCost}</div>
                        </div>
                        <div key={(iterKey += 1)} className="flex flex-wrap justify-center">
                            {repair.materialData
                                .sort((a,b) => (a.material.materialName.toLowerCase() > b.material.materialName.toLowerCase()) ? 1 : ((b.material.materialName.toLowerCase() > a.material.materialName.toLowerCase()) ? -1 : 0))
                                .map(material => (
                                <div key={(iterKey += 1)} className="card w-96 shadow-md bg-base-300 mb-8 mx-6">
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