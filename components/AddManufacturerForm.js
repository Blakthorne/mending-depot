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
    let manufacturers = []

    // Retrieve the manufacturers for use in the manufacturers[] for the uniqueness check
    const { data, error } = useSWR('/api/manufacturers')
    if (error) return <div>{ error }</div>
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
     * @param {*} e The event provided when the submit button is pressed
     */
    const submitData = async e => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            // Don't submit id because of default creation by the database
            const body = { manufacturerName }
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
        setManufacturerName('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormTextInput onChange={(value) => setManufacturerName(value)} placeholder={ "'Filmoplast'" } input={ manufacturerName } inputId={ "Manufacturer" } uniquesArray={ manufacturers } constraints={ ["unique"] } errorMessage={ "That manufacturer already exists. Please enter a new manufacturer." }/>

                <FormSubmitButton requiredInputs={ [manufacturerName] } uniques={ [{"key": manufacturerName, "values": manufacturers}] }/>
                <FormCancelButton clearInvalids={() => clearErrors()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}