import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import FormSelectInput from './FormSelectInput'

/**
 * 
 * @returns HTML form for adding a material to the database, along with submit and cancel buttons
 */
export default function AddInventoryTransactionForm() {

    // Create state for the attributes of a repair
    const [datePurchased, setDatePurchased] = useState('')
    const [dateReceived, setDateReceived] = useState('')
    const [unitsPurchased, setUnitsPurchased] = useState('')
    const [transactionCost, setTransactionCost] = useState('')
    const [materialId, setMaterialId] = useState('')
    const [providerId, setProviderId] = useState('')

    // Create state for determining the validity of a date;
    // Changed in the FormTextInput component where the constraint "date" is provided
    // and passed via function through the optional parameter isDateValid
    const [datePurchasedValid, setDatePurchasedValid] = useState(false)
    const [dateReceivedValid, setDateReceivedValid] = useState(false)


    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the provider table to get the provider names and ids to be used as the foreign key in the inventory transactions table
    const { data: providersData, error: providersError } = useSWR<Provider[], Error>('/api/providers')

    // Retrieve the materials table to get the material names and ids to be used as the foreign key in the inventory transactions table
    const { data: materialsData, error: materialsError } = useSWR<Material[], Error>('/api/materials')

    if (providersError) console.log(providersError)
    if (!providersData) return <div>Loading...</div>

    // Rename the retrieved providers for specificity later
    let providers: Provider[] = providersData

    
    if (materialsError) console.log(materialsError)
    if (!materialsData) return <div>Loading...</div>

    // Rename the retrieved materials for specificity later
    let materials: Material[] = materialsData

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
            const body: InventoryTransaction = { datePurchased, dateReceived, unitsPurchased, transactionCost, materialId, providerId }
            await fetch('/api/inventorytransactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/inventorytransactions')
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
        setDatePurchased('')
        setDateReceived('')
        setUnitsPurchased('')
        setTransactionCost('')
        setMaterialId('')
        setProviderId('')

        setDatePurchasedValid(false)
        setDateReceivedValid(false)
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setDatePurchased(value)}
                    placeholder={ "'01 - 18 - 2017'" }
                    input={ datePurchased }
                    inputId={ "Date Purchased" }
                    constraints={ ["date"] }
                    errorMessage={ "Sorry, but that's not a real date." }
                    dateIsValid={(validity) => setDatePurchasedValid(validity)}
                />

                <FormTextInput
                    onChange={(value) => setDateReceived(value)}
                    placeholder={ "'02 - 09 - 2017'" }
                    input={ dateReceived }
                    inputId={ "Date Received" }
                    constraints={ ["date"] }
                    errorMessage={ "Sorry, but that's not a real date." }
                    dateIsValid={(validity) => setDateReceivedValid(validity)}
                />

                <FormTextInput
                    onChange={(value) => setUnitsPurchased(value)}
                    placeholder={ "'8'" }
                    input={ unitsPurchased }
                    inputId={ "Units Purchased" }
                    constraints={ ["decimal"] }
                    errorMessage={ "Please only enter a decimal value here." }
                />

                <FormTextInput
                    onChange={(value) => setTransactionCost(value)}
                    placeholder={ "'43.99'" }
                    input={ transactionCost }
                    inputId={ "Transaction Cost" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                />

                <FormSelectInput
                    onChange={(value) => setMaterialId(value)}
                    input={ materialId }
                    inputId={ "Material" }
                    options={ materials }
                    displayKey={ "materialName"}
                    storeKey={ "id" }
                />

                <FormSelectInput
                    onChange={(value) => setProviderId(value)}
                    input={ providerId }
                    inputId={ "Provider" }
                    options={ providers }
                    displayKey={ "providerName"}
                    storeKey={ "id" }
                />

                <FormSubmitButton
                    requiredInputs={ [datePurchased, unitsPurchased, materialId, providerId] }
                    text="Add Inventory Transaction"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}