import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

/**
 * 
 * @returns HTML form for adding a material type to the database, along with submit and cancel buttons
 */
export default function AddMaterialTypeForm() {

    // Create state for the attribute of an repair type
    const [materialTypeName, setMaterialTypeName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the material types to be used in the
    // uniqueness check of the FormSubmitButton component
    let materialTypes: string[] = []

    // Retrieve the material types for use in the materialTypes[] for the uniqueness check
    const { data, error } = useSWR<MaterialType[], Error>('/api/materialtypes')
    if (error) console.log(error)
    else {

        // Extract all the names of the material types
        for (const entry in data) {
            materialTypes.push(data[entry].materialTypeName)
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
            const body: MaterialType = { materialTypeName }
            await fetch('/api/materialtypes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/materialtypes')
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
        setMaterialTypeName('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setMaterialTypeName(value)}
                    placeholder={ "'Japanese Paper'" }
                    input={ materialTypeName }
                    inputId={ "Material Type" }
                    uniquesArray={ materialTypes }
                    constraints={ ["unique"] }
                    errorMessage={ "That repair type already exists. Please enter a new repair type." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [materialTypeName] }
                    uniques={ [{"key": materialTypeName, "values": materialTypes}] }
                    text="Add Material Type"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}