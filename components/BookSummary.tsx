import useSWR from 'swr'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop';

type SummaryComponent = {
    bookId: string
}

type MaterialData = {
    materialForRepair: MaterialForRepair;
    material: Material;
    unitType: UnitType;
    materialHeight?: MaterialHeight;
    materialWidth?: MaterialWidth;
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
 * @param {string} book The specified book id
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
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <CircularProgress />
        </Backdrop>
        )
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="font-sans text-slate-200 text-8xl text-center drop-shadow-lg tracking-wide mb-6">
                {data.book.title}
            </div>
            <div className="font-sans text-slate-200 text-xl text-center drop-shadow-lg tracking-wide mb-14">
                Owned by {data.owner.ownerName}
            </div>
            <div className="table border-collapse table-auto text-sm mt-16 mb-32 mx-auto">
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">Author</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.author}</div>
                </div>
                <div className="table-row-group">
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">Author</div>
                    <div className="table-cell border-b border-slate-600 font-medium p-4 pt-2 pb-2 text-left">{data.book.author}</div>
                </div>
            </div>
        </div>
        
    )
}