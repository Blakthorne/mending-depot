'use client'
import useSWR from 'swr'

type TableComponent = {
    table: string;
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
            <span className="loading loading-infinity loading-lg text-info mt-16 mb-32"></span>
        )
    }
    if (data[0] == undefined) return <div className="mt-16">There is no data in this table</div>

    // Used for creating unique html keys in the table cells
    let cellKey = 0

    return (
    <div className="overflow-x-auto">
    <table className="table table-zebra text-xs mt-16 mb-32">
        <thead>
            <tr className="table-row">
                {Object.keys(data[0])
                    .map(item => (
                    <th
                        key={item.toString()}
                        className="capitalize">
                            {item.split(/(?=[A-Z])/).join(" ")}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map(row => (
                <tr className="hover"
                    key={Object.values(row).toString()}>
                    {Object.values(row)
                        .map(maybeNull => maybeNull ? maybeNull : "-")
                        .map(cell => (
                            <td
                                key={(cellKey += 1).toString()}>
                                    {cell}
                            </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
    </div>
    )
}