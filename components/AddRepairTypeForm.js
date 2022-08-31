import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

/**
 * 
 * @returns HTML form for adding a repair type to the database, along with submit and cancel buttons
 */
export default function AddRepairTypeForm() {

    // Create state for the attribute of an repair type
    const [repairTypeName, setRepairTypeName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the repair types to be used in the
    // uniqueness check of the FormSubmitButton component
    let repairTypes = []

    // Retrieve the owners for use in the repairTypes[] for the uniqueness check
    const { data, error } = useSWR('/api/repairtypes')
    if (error) return <div>{ error }</div>
    if (!data) return <div>Loading...</div>
    else {

        // Extract all the names of the repair types
        for (const entry in data) {
            repairTypes.push(data[entry].repairTypeName)
        }
    }

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {*} e The event provided when the submit button is pressed
     */
    const submitData = async e => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            // Don't submit id because of default creation by the database
            const body = { repairTypeName }
            await fetch('/api/repairtypes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/repairtypes')
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Clear all the formatting for showing errors in the form
     */
    const clearErrors = () => {
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

    /**
     * Clear all the form inputs
     */
    const cancelInputs = () => {
        setRepairTypeName('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormTextInput onChange={(value) => setRepairTypeName(value)} placeholder={ "'Resewing'" } input={ repairTypeName } inputId={ "Repair Type" } uniquesArray={ repairTypes } constraints={ ["unique"] } errorMessage={ "That repair type already exists. Please enter a new repair type." }/>

                <FormSubmitButton requiredInputs={ [repairTypeName] } uniques={ [{"key": repairTypeName, "values": repairTypes}] }/>
                <FormCancelButton clearInvalids={() => clearErrors()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}