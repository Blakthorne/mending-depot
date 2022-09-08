import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

/**
 * 
 * @returns HTML form for adding an owner to the database, along with submit and cancel buttons
 */
export default function AddOwnerForm() {

    // Create state for the attribute of an owner
    const [ownerName, setOwnerName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the owners to be used in the
    // uniqueness check of the FormSubmitButton component
    let names: string[] = []

    // Retrieve the owners for use in the names[] for the uniqueness check
    const { data, error } = useSWR<Owner[], Error>('/api/owners')
    if (error) console.log(error)
    if (!data) return <div>Loading...</div>
    else {

        // Extract all the names of the owners
        for (const entry in data) {
            names.push(data[entry].ownerName)
        }
    }

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
    const submitData = async (e:  React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            // Don't submit id because of default creation by the database
            const body: Owner = { ownerName }
            await fetch('/api/owners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/owners')
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Clear all the formatting for showing errors in the form
     */
    const clearErrors = (): void => {
        const errorMessages: HTMLCollection = document.getElementsByClassName("errorMessage")
        const inputs: HTMLCollection = document.getElementsByClassName("input")

        for (let i = 0; i < errorMessages.length; ++i) {
            errorMessages[i].classList.remove("visible")
            errorMessages[i].classList.add("invisible")
        }
        for (let i = 0; i < inputs.length; ++i) {
            inputs[i].classList.remove("border-red-500")
            inputs[i].classList.add("border-gray-50")
            inputs[i].classList.add("focus:border-sky-400")
        }
    }

    /**
     * Clear all the form inputs
     */
    const cancelInputs = (): void => {
        setOwnerName('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setOwnerName(value)}
                    placeholder={ "'Virgil'" } input={ ownerName }
                    inputId={ "Owner" }
                    uniquesArray={ names }
                    constraints={ ["unique"] }
                    errorMessage={ "That name already exists. Please enter a new name." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [ownerName] }
                    uniques={ [{"key": ownerName, "values": names}] }
                    text="Add Owner"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}