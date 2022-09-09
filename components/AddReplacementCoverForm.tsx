import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import FormSelectInput from './FormSelectInput'

/**
 * 
 * @returns HTML form for adding a replacement cover to the database, along with submit and cancel buttons
 */
export default function AddReplacementCoverForm() {

    // Create state for the attributes of a repair
    const [coverType, setCoverType] = useState(undefined)
    const [spineMaterial, setSpineMaterial] = useState(undefined)
    const [sideMaterial, setSideMaterial] = useState(undefined)
    const [repairId, setRepairId] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the repairs to be used in the
    // uniqueness check of the FormSubmitButton component
    let curRepairs: string[] = []

    // Retrieve the repair table to get the repair ids to be used as the foreign key in the replacement cover table
    const { data: repairs, error: repairError } = useSWR<Repair[], Error>('/api/repairs')

    // Retrieve the replacementcovers for use in the curRepairs[] for the uniqueness check
    const { data: replacementCoversData, error: replacementCoversError } = useSWR<ReplacementCover[], Error>('/api/replacementcovers')

    if (repairError) console.log(repairError)

    if (replacementCoversError) console.log(replacementCoversError)
    else {

        // Extract all the ids of the repairs
        for (const entry in replacementCoversData) {
            curRepairs.push(replacementCoversData[entry].repairId)
        }
    }

    // Create array of the cover type options to be used in the FormSelectInput component
    let coverTypeOptions =  [{"display": "Full Bound", "store": "FULL"}, {"display": "Quarter Bound", "store": "QUARTER"}, {"display": "Three Quarter Bound", "store": "THREEQUARTER"}]

    // Create array of the cover material options to be used in the FormSelectInput component
    let coverMaterialOptions =  [{"display": "Buckram", "store": "BUCKRAM"}, {"display": "Book Cloth", "store": "BOOKCLOTH"}, {"display": "Leather", "store": "LEATHER"}] 

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
            const body: ReplacementCover = { coverType, spineMaterial, sideMaterial, repairId }
            await fetch('/api/replacementcovers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/replacementcovers')
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
    const cancelInputs = () => {
        setCoverType('')
        setSpineMaterial('')
        setSideMaterial('')
        setRepairId('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormSelectInput
                    onChange={(value) => setCoverType(value)}
                    input={ coverType }
                    inputId={ "Cover Type" }
                    options={ coverTypeOptions }
                    displayKey={ "display"}
                    storeKey={ "store" }
                    required={ false }
                />

                <FormSelectInput
                    onChange={(value) => setSpineMaterial(value)}
                    input={ spineMaterial }
                    inputId={ "Spine Material" }
                    options={ coverMaterialOptions }
                    displayKey={ "display"}
                    storeKey={ "store" }
                    required={ false }
                />

                <FormSelectInput
                    onChange={(value) => setSideMaterial(value)}
                    input={ sideMaterial }
                    inputId={ "Side Material" }
                    options={ coverMaterialOptions }
                    displayKey={ "display"}
                    storeKey={ "store" }
                    required={ false }
                />

                <FormSelectInput
                    onChange={(value) => setRepairId(value)}
                    input={ repairId }
                    inputId={ "Repair" }
                    options={ repairs }
                    displayKey={ "id"}
                    storeKey={ "id" }
                    uniquesArray={ curRepairs }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [repairId] }
                    text="Add Replacement Cover"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}