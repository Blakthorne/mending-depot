import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

/**
 * 
 * @returns HTML form for adding a manufacturer to the database, along with submit and cancel buttons
 */
export default function AddManufacturerForm() {

    // Create state for the attribute of an owner
    const [manufacturerName, setManufacturerName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the manufacturers to be used in the
    // uniqueness check of the FormSubmitButton component
    let manufacturers: string[] = []

    // Retrieve the manufacturers for use in the manufacturers[] for the uniqueness check
    const { data, error } = useSWR<Manufacturer[], Error>('/api/manufacturers')
    if (error) console.log(error)
    if (!data) return <div>Loading...</div>
    else {

        // Extract all the names of the owners
        for (const entry in data) {
            manufacturers.push(data[entry].manufacturerName)
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
            const body: Manufacturer = { manufacturerName }
            await fetch('/api/manufacturers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/manufacturers')
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
        setManufacturerName('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >
                <FormTextInput
                    onChange={(value) => setManufacturerName(value)}
                    placeholder={ "'Filmoplast'" }
                    input={ manufacturerName }
                    inputId={ "Manufacturer" }
                    uniquesArray={ manufacturers }
                    constraints={ ["unique"] }
                    errorMessage={ "That manufacturer already exists. Please enter a new manufacturer." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [manufacturerName] }
                    uniques={ [{"key": manufacturerName, "values": manufacturers}] }
                    text="Add Manufacturer"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}