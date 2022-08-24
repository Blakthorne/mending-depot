import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import React, { useState } from 'react'

export default function Form({ table, items }) {
    const router = useRouter()
    const { mutate } = useSWRConfig()
    const [ownerName, setOwnerName] = useState('')

    const submitData = async e => {
        e.preventDefault()
        try {
            const body = { ownerName }
            await fetch(`/api/` + table, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            setOwnerName('')
            mutate('/api/' + table)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="mt-16">
            <form
                onSubmit={submitData}>
                <h1>Add Owner</h1>
                <input
                    className="hover:outline-slate-100 w-full p-2 my-2 mx-0 rounded"
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="Owner Name"
                    type="text"
                    value={ownerName}
                    required
                />
                <button
                    className="bg-slate-800 hover:bg-slate-700 py-2 px-4 shadow-sm shadow-slate-800"
                    type="submit"
                >Save Changes</button>
                <a className="ml-4 text-slate-900" href="#" onClick={() => router.push('/')}>
                    or Cancel
                </a>
            </form>
        </div>
    )
}