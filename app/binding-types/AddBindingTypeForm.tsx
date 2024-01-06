'use client'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import FormTextInput from '../components/forms/FormTextInput'
import FormSubmitButton from '../components/forms/FormSubmitButton'
import FormCancelButton from '../components/forms/FormCancelButton'
import FormLayout from '../components/forms/FormLayout'

/**
 * 
 * @returns HTML form for adding a binding type to the database, along with submit and cancel buttons
 */
export default function AddBindingTypeForm() {

    // Create state for the attribute of an binding type
    const [bindingTypeName, setBindingTypeName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the binding types to be used in the
    // uniqueness check of the FormSubmitButton component
    let bindingTypes: string[] = []

    // Retrieve the binding types for use in the bindingTypes[] for the uniqueness check
    const { data, error } = useSWR<BindingType[], Error>('/api/bindingtypes')
    if (error) console.log(error)
    else {

        // Extract all the names of the binding types
        for (const entry in data) {
            bindingTypes.push(data[entry].bindingTypeName)
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
            const body: BindingType = { bindingTypeName }
            await fetch('/api/bindingtypes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/bindingtypes')
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
        setBindingTypeName('')
    }

    return (
        <FormLayout formTitle="Add Binding Type">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setBindingTypeName(value)}
                    placeholder={ "'Smyth Sewn'" }
                    input={ bindingTypeName }
                    inputId={ "Binding Type" }
                    uniquesArray={ bindingTypes }
                    constraints={ ["unique"] }
                    errorMessage={ "That binding type already exists. Please enter a new binding type." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [bindingTypeName] }
                    uniques={ [{"key": bindingTypeName, "values": bindingTypes}] }
                    text="Add Binding Type"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </FormLayout>
    )
}