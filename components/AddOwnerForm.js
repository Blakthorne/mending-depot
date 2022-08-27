import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

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

    const clear = () => {
        const errorMessages = document.getElementsByClassName("errorMessage")
        const inputs = document.getElementsByClassName("input")

        for (let i = 0; i < errorMessages.length; ++i) {
            errorMessages[i].classList.remove("visible")
            errorMessages[i].classList.add("invisible")
        }
        for (let i = 0; i < inputs.length; ++i) {
            inputs[i].classList.remove("border-red-400")
            inputs[i].classList.add("border-slate-900")
            inputs[i].classList.add("focus:border-sky-400")
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

                <FormSubmitButton requiredInputs={ [ownerName] }/>
                <FormCancelButton clearInvalids={() => clear()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}