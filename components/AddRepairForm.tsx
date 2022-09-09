import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import FormSelectInput from './FormSelectInput'

/**
 * 
 * @returns HTML form for adding a repair to the database, along with submit and cancel buttons
 */
export default function AddRepairForm() {

    // Create state for the attributes of a repair
    const [repairTypeId, setRepairTypeId] = useState('')
    const [repairMaterialsCost, setRepairMaterialsCost] = useState('')
    const [bookId, setBookId] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the books table to get the book names and ids to be used as the foreign key in the repairs table
    const { data: books, error: booksError } = useSWR<Book[], Error>('/api/books')
    if (booksError) console.log(booksError)

    // Retrieve the repairtypes table to get the repair type names and ids to be used as the foreign key in the repairs table
    const { data: repairTypes, error: repairTypesError } = useSWR<RepairType[], Error>('/api/repairtypes')
    if (repairTypesError) console.log(repairTypesError)

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
    const submitData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            // Don't submit id because of default creation by the database
            const body: Repair = { repairTypeId, repairMaterialsCost, bookId }
            await fetch('/api/repairs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/repairs')
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Clear all the formatting for showing errors in the form
     */
    const clearErrors = (): void => {
        const errorMessages = document.getElementsByClassName("errorMessage")
        const inputs = document.getElementsByClassName("input")

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
        setRepairTypeId('')
        setRepairMaterialsCost('')
        setBookId('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormSelectInput
                    onChange={(value) => setRepairTypeId(value)}
                    input={ repairTypeId }
                    inputId={ "Repair Type" }
                    options={ repairTypes }
                    displayKey={ "repairTypeName"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setRepairMaterialsCost(value)}
                    placeholder={ "'14.89'" }
                    input={ repairMaterialsCost }
                    inputId={ "Repair Materials Cost" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                    required={ false }
                />

                <FormSelectInput
                    onChange={(value) => setBookId(value)}
                    input={ bookId }
                    inputId={ "Associated Book" }
                    options={ books }
                    displayKey={ "title"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [repairTypeId, bookId] }
                    text="Add Repair"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}