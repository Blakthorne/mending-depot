import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import FormSelectInput from './FormSelectInput'

/**
 * 
 * @returns HTML form for adding a materialforrepair entry to the database, along with submit and cancel buttons
 */
export default function AddMaterialForRepairForm() {

    // Create state for the attributes of a materialforrepair entry
    const [repairId, setRepairId] = useState('')
    const [materialId, setMaterialId] = useState('')
    const [amountUsed, setAmountUsed] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the repairs table to get the repair names and ids to be used as the foreign key in the materialforrepair table
    const { data: repairsData, error: repairsError } = useSWR('/api/repairs')

    // Retrieve the materials table to get the material names and ids to be used as the foreign key in the materialforrepair table
    const { data: materialsData, error: materialsError } = useSWR('/api/materials')

    if (repairsError) return <div>{ repairsError }</div>
    if (!repairsData) return <div>Loading...</div>

    // Rename the retrieved books for specificity later
    let repairs = repairsData

    if (materialsError) return <div>{ materialsError }</div>
    if (!materialsData) return <div>Loading...</div>

    // Rename the retrieved books for specificity later
    let materials = materialsData

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
            const body = { repairId, materialId, amountUsed }
            await fetch('/api/materialforrepair', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/materialforrepair')
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
            inputs[i].classList.remove("border-red-500")
            inputs[i].classList.add("border-gray-50")
            inputs[i].classList.add("focus:border-sky-400")
        }
    }

    /**
     * Clear all the form inputs
     */
    const cancelInputs = () => {
        setRepairId('')
        setMaterialId('')
        setAmountUsed('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormSelectInput onChange={(value) => setRepairId(value)} input={ repairId } inputId={ "Repair" } options={ repairs } displayKey={ "id"} storeKey={ "id" }/>

                <FormSelectInput onChange={(value) => setMaterialId(value)} input={ materialId } inputId={ "Material" } options={ materials } displayKey={ "materialName"} storeKey={ "id" }/>

                <FormTextInput onChange={(value) => setAmountUsed(value)} placeholder={ "'3.5'" } input={ amountUsed } inputId={ "Amount Used" } constraints={ ["decimal"] } errorMessage={ "Please only enter a decimal value here." }/>

                <FormSubmitButton requiredInputs={ [repairId, materialId, amountUsed] }/>
                <FormCancelButton clearInvalids={() => clearErrors()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}