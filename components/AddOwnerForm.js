import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'

export default function AddOwnerForm() {

    let names = []
    const { data, error } = useSWR('/api/owners')
    if (error) return <div>{ error }</div>
    else {
        for (const entry in data) {
            names.push(data[entry].ownerName)
        }
    }

    const { mutate } = useSWRConfig()
    const [ownerName, setOwnerName] = useState('')

    const submitData = async e => {
        e.preventDefault()
        if (ownerName in names) {
            console.log(ownerName, names)
            return false
        }
        try {
            const body = { ownerName }
            await fetch('/api/owners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            setOwnerName('')
            mutate('/api/owners')
        } catch (error) {
            console.error(error)
        }
    }

    const checkName = () => {
        // setOwnerName(letter)
        if (ownerName in names) {
            return false
        }
    }

    return (
        <div className="mt-16">
            <form
                onSubmit={submitData}>
                <label>Add Owner</label>
                <input
                    className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 peer"
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="'John Doe'"
                    type="text"
                    value={ownerName}
                    id="name"
                    required
                />
                <p className="peer-invalid:visible">
                    That name already exists. Please enter a new name.
                </p>
                <button
                    className="bg-slate-800 hover:bg-slate-700 py-2 px-4 shadow-sm shadow-slate-800"
                    type="submit"
                >Save Changes</button>
                <input
                    className="ml-4 text-slate-900"
                    onClick={() => setOwnerName('')}
                    value="or Cancel"
                    type="button"
                />
            </form>
        </div>
    )
}