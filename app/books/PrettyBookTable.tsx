'use client'
import useSWR from 'swr'
import React, { useState } from 'react'
import PrettyBookModal from './PrettyBookModal'

export default function PrettyBookTable() {

    const [curBookId, setCurBookId] = useState('')
    const [curBookTitle, setCurBookTitle] = useState('')

    // Retrieve from 'api/books/pretty'
    const { data, error } = useSWR<object[], Error>('/api/books/pretty')
    if (error) console.log(error)
    if (!data) {
        return (
            <span className="loading loading-infinity loading-lg text-info mt-16 mb-32"></span>
        )
    }
    if (data[0] == undefined) return <div className="mt-16">There is no data in this table</div>

    const rowClick = (bookId: string, bookTitle: string) => {
        setCurBookId(bookId)
        setCurBookTitle(bookTitle)

        // I have to retype the element specifically as a Dialog Element or else TypeScript cries
        let elem: HTMLDialogElement = document.getElementById('my_modal_5') as HTMLDialogElement
        elem.showModal()
    }

    // Copied from https://www.w3schools.com/howto/howto_js_sort_table.asp
    function sortColumn(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("pretty-table");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount ++;
            } else {
                /* If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again. */
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    // Used for creating unique html keys in the table cells
    let cellKey = 0

    return (
        <div className="overflow-x-auto">
            <table id="pretty-table"
                   className="table table-zebra text-s mt-16 mb-32">
                <thead>
                    <tr className="table-row">
                        {Object.keys(data[0])
                            .map((item, index) => item === 'id' ? null :
                            (
                            <th
                                key={item.toString()}
                                className="capitalize hover:bg-base-300"
                                onClick={() => sortColumn(index - 1)}>
                                    {item.split(/(?=[A-Z])/).join(" ")}
                            </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr className="hover"
                            key={Object.values(row).toString()}>
                            {Object.values(row)
                                .map(cell => cell === '' ? '-' : cell)
                                .map(cell => Object.values(row)[0] === cell ? null :
                                (
                                    <td key={(cellKey += 1).toString()}
                                        onClick={() => rowClick(Object.values(row)[0], Object.values(row)[1])}>
                                            {cell}
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <PrettyBookModal
                curBookTitle={curBookTitle}
                curBookId={curBookId}
            />
        </div>
    )
}