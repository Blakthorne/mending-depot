'use client'
import useSWR from 'swr'
import Link from 'next/link';
import React, { useState } from 'react'

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

    const handleClick = (bookId: string, bookTitle: string) => {
        setCurBookId(bookId)
        setCurBookTitle(bookTitle)

        // I have to retype the element specifically as a Dialog Element or else TypeScript cries
        let elem: HTMLDialogElement = document.getElementById('my_modal_5') as HTMLDialogElement
        elem.showModal()
    }

    // Used for creating unique html keys in the table cells
    let cellKey = 0

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra text-s mt-16 mb-32">
                <thead>
                    <tr className="table-row">
                        {Object.keys(data[0])
                            .map(item => item === 'id' ? null :
                            (
                            <th
                                key={item.toString()}
                                className="capitalize">
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
                                        onClick={() => handleClick(Object.values(row)[0], Object.values(row)[1])}>
                                            {cell}
                                    </td>
                                ))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{curBookTitle}</h3>
                    <div className="flex gap-x-8 justify-center mt-4 mb--4">
                        <Link
                            className="btn btn-outline"
                            href={"/summary/" + curBookId}>Summary
                        </Link>
                        <Link
                            className="btn btn-outline"
                            href={"/books/edit/" + curBookId}>Edit
                        </Link>
                        <Link
                            className="btn btn-outline"
                            href={"/new-repair/" + curBookId}>Add Repairs
                        </Link>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}