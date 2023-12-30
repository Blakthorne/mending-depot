'use client'
import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from '../components/forms/FormTextInput'
import FormSubmitButton from '../components/forms/FormSubmitButton'
import FormCancelButton from '../components/forms/FormCancelButton'

/**
 * 
 * @returns HTML form for adding a unit type to the database, along with submit and cancel buttons
 */
export default function AddUnitTypeForm() {

    // Create state for the attribute of an unit type
    const [unitTypeName, setUnitTypeName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the unit types to be used in the
    // uniqueness check of the FormSubmitButton component
    let unitTypes: string[] = []

    // Retrieve the unit types for use in the unitTypes[] for the uniqueness check
    const { data, error } = useSWR<UnitType[], Error>('/api/unittypes')
    if (error) console.log(error)
    else {

        // Extract all the names of the unit types
        for (const entry in data) {
            unitTypes.push(data[entry].unitTypeName)
        }
    }

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
            const body: UnitType = { unitTypeName }
            await fetch('/api/unittypes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/unittypes')
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
            inputs[i].classList.remove("focus:border-error")
            inputs[i].classList.add("focus:border-info")
        }
    }

    /**
     * Clear all the form inputs
     */
    const cancelInputs = (): void => {
        setUnitTypeName('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setUnitTypeName(value)}
                    placeholder={ "'Inches Squared'" }
                    input={ unitTypeName }
                    inputId={ "Unit Type" }
                    uniquesArray={ unitTypes }
                    constraints={ ["unique"] }
                    errorMessage={ "That unit type already exists. Please enter a new unit type." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [unitTypeName] }
                    uniques={ [{"key": unitTypeName, "values": unitTypes}] }
                    text="Add Unit Type"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}