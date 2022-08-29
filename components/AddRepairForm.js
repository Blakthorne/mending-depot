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
    const [repairType, setRepairType] = useState('')
    const [repairMaterialsCost, setRepairMaterialsCost] = useState('')
    const [bookId, setBookId] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the books table to get the book names and ids to be used as the foreign key in the repairs table
    const { data, error } = useSWR('/api/books')
    if (error) return <div>{ error }</div>
    if (!data) return <div>Loading...</div>

    // Rename the retrieved books for specificity later
    let books = data

    // Create array of the repairType options to be used in the FormSelectInput component
    let repairTypeOptions =  [{"type": "BASEHINGE"}, {"type": "TIPIN"}, {"type": "PAPER"}, {"type": "FLYSHEET"}, {"type": "SPINEREPLACEMENT"}, {"type": "COVERREPLACEMENT"}, {"type": "RESEWING"}] 

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
            const body = { repairType, repairMaterialsCost, bookId }
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
        setRepairType('')
        setRepairMaterialsCost('')
        setBookId('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormSelectInput onChange={(value) => setRepairType(value)} input={ repairType } inputId={ "Repair Type" } options={ repairTypeOptions } displayKey={ "type"} storeKey={ "type" }/>

                <FormTextInput onChange={(value) => setRepairMaterialsCost(value)} placeholder={ "'14.89'" } input={ repairMaterialsCost } inputId={ "Repair Materials Cost" } constraints={ ["money"] } errorMessage={ "Please only enter a dollar value here." }/>

                <FormSelectInput onChange={(value) => setBookId(value)} input={ bookId } inputId={ "Associated Book" } options={ books } displayKey={ "title"} storeKey={ "id" }/>

                <FormSubmitButton requiredInputs={ [repairType, bookId] }/>
                <FormCancelButton clearInvalids={() => clearErrors()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}