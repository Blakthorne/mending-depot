import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormInputErrorMessage from './FormInputErrorMessage'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

export default function AddOwnerForm() {

    let names = []
    const { data, error } = useSWR('/api/owners')
    if (error) return <div>{ error }</div>
    else if (!data) {}
    else {
        for (const entry in data) {
            names.push(data[entry].ownerName)
        }
    }

    const { mutate } = useSWRConfig()
    const [ownerName, setOwnerName] = useState('')

    const submitData = async e => {
        e.preventDefault()
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

    const cancelInputs = () => {
        setOwnerName('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormTextInput onChange={(value) => setOwnerName(value)} placeholder={ "'Virgil'" } input={ ownerName } values={ names } inputId={ "Owner" } constraints={ ["unique"] } errorMessage={ "That name already exists. Please enter a new name." }/>

                <FormSubmitButton requiredInputs={ [ownerName] } uniques={ [{"key": ownerName, "values": names}] }/>
                <FormCancelButton cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}