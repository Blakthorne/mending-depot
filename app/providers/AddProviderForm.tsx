'use client'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import FormTextInput from '../components/forms/FormTextInput'
import FormSubmitButton from '../components/forms/FormSubmitButton'
import FormCancelButton from '../components/forms/FormCancelButton'
import FormLayout from '../components/forms/FormLayout'

/**
 * 
 * @returns HTML form for adding a provider to the database, along with submit and cancel buttons
 */
export default function AddProviderForm() {

    // Create state for the attribute of an provider
    const [providerName, setProviderName] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the providers to be used in the
    // uniqueness check of the FormSubmitButton component
    let providers: string[] = []

    // Retrieve the owners for use in the providers[] for the uniqueness check
    const { data, error } = useSWR<Provider[], Error>('/api/providers')
    if (error) console.log(error)

    // Extract all the names of the providers
    for (const entry in data) {
        providers.push(data[entry].providerName)
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
            const body: Provider = { providerName }
            await fetch('/api/providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/providers')
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
            inputs[i].classList.remove("focus:border-error")
            inputs[i].classList.add("focus:border-info")
        }
    }

    /**
     * Clear all the form inputs
     */
    const cancelInputs = (): void => {
        setProviderName('')
    }

    return (
        <FormLayout formTitle="Providers">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setProviderName(value)}
                    placeholder={ "'Talas'" } input={ providerName }
                    inputId={ "Provider" }
                    uniquesArray={ providers }
                    constraints={ ["unique"] }
                    errorMessage={ "That provider already exists. Please enter a new provider." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [providerName] }
                    uniques={ [{"key": providerName, "values": providers}] }
                    text="Add Provider"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </FormLayout>
    )
}