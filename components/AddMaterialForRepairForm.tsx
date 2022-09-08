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
    const { data: repairsData, error: repairsError } = useSWR<Repair[], Error>('/api/repairs')

    // Retrieve the materials table to get the material names and ids to be used as the foreign key in the materialforrepair table
    const { data: materialsData, error: materialsError } = useSWR<Material[], Error>('/api/materials')

    if (repairsError) console.log(repairsError)
    if (!repairsData) return <div>Loading...</div>

    // Rename the retrieved books for specificity later
    let repairs: Repair[] = repairsData

    if (materialsError) console.log(materialsError)
    if (!materialsData) return <div>Loading...</div>

    // Rename the retrieved books for specificity later
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
            const body: MaterialForRepair = { repairId, materialId, amountUsed }
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
        setRepairId('')
        setMaterialId('')
        setAmountUsed('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormSelectInput
                    onChange={(value) => setRepairId(value)}
                    input={ repairId }
                    inputId={ "Repair" }
                    options={ repairs }
                    displayKey={ "id"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormSelectInput
                    onChange={(value) => setMaterialId(value)}
                    input={ materialId }
                    inputId={ "Material" }
                    options={ materials }
                    displayKey={ "materialName"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setAmountUsed(value)}
                    placeholder={ "'3.5'" }
                    input={ amountUsed }
                    inputId={ "Amount Used" }
                    constraints={ ["decimal"] }
                    errorMessage={ "Please only enter a decimal value here." }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [repairId, materialId, amountUsed] }
                    text="Add Material For Repair"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}