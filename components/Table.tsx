import useSWR from 'swr'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop';

type TableComponent = {
    table: string
}

/**
 * 
 * @param {string} table The table in the database to show as a table on the page 
 * @returns HTML table populated with information from the database
 */
export default function Table({ table }: TableComponent) {

    // Retrieve the table requested by the parent component
    const { data, error } = useSWR<object[], Error>('/api/' + table)
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
    if (data[0] == undefined) return <div className="mt-16">There is no data in this table</div>

    // Used for creating unique html keys in the table cells
    let cellKey = 0

    return (
    <div className="table border-collapse table-auto text-sm mt-16 mb-32">
        <div className="table-header-group">
            <div className="table-row">
                {Object.keys(data[0])
                    .map(item => (
                    <div key={item.toString()} className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-0 pb-2 text-left capitalize">{item.split(/(?=[A-Z])/).join(" ")}</div>
                ))}
            </div>
        </div>
        <div className="table-row-group">
            {data.map(row => (
                <div key={Object.values(row).toString()} className="table-row">
                    {Object.values(row)
                        .map(maybeNull => maybeNull ? maybeNull : "-")
                        .map(cell => (
                            <div key={(cellKey += 1).toString()} className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-2 pb-2 text-left">{cell}</div>
                    ))}
                </div>
            ))}
        </div>
    </div>
    )
}