import useSWR from 'swr'

export default function Table({ table }) {
    const { data, error } = useSWR('/api/' + table)
    if (error) return <div>{ error }</div>
    if (!data) return <div>Loading ...</div>

    return (
    <div className="table border-collapse table-auto text-sm">
        <div className="table-header-group">
            <div className="table-row">
                {Object.keys(data[0]).map(item => (
                    <div key={item.toString()} className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-0 pb-0 text-left">{item}</div>
                ))}
            </div>
        </div>
        <div className="table-row-group">
            {data.map(row => (
                <div key={Object.values(row).toString()} className="table-row">
                    {Object.values(row)
                        .map(maybeNull => maybeNull ? maybeNull : "")
                        .map(cell => (
                            <div key={cell.toString()} className="table-cell border-b border-slate-600 font-medium p-4 pl-8 pt-0 pb-0 text-left">{cell}</div>
                    ))}
                </div>
            ))}
        </div>
    </div>
    )
}