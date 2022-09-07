import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import FormSelectInput from './FormSelectInput'
import { CoverType, CoverMaterial } from '@prisma/client'

/**
 * 
 * @returns HTML form for adding a replacement cover to the database, along with submit and cancel buttons
 */
export default function AddReplacementCover() {

    // Create state for the attributes of a repair
    const [coverType, setCoverType] = useState('')
    const [spineMaterial, setSpineMaterial] = useState('')
    const [sideMaterial, setSideMaterial] = useState('')
    const [repairId, setRepairId] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the repairs to be used in the
    // uniqueness check of the FormSubmitButton component
    let curRepairs = []

    // Retrieve the repair table to get the repair ids to be used as the foreign key in the replacement cover table
    const { data: repairData, error: repairError } = useSWR('/api/repairs')

    // Retrieve the replacementcovers for use in the curRepairs[] for the uniqueness check
    const { data: replacementCoversData, error: replacementCoversError } = useSWR('/api/replacementcovers')

    if (repairError) return <div>{ repairError }</div>
    if (!repairData) return <div>Loading...</div>

    if (replacementCoversError) return <div>{ replacementCoversError }</div>
    if (!replacementCoversData) return <div>Loading...</div>
    else {

        // Extract all the ids of the repairs
        for (const entry in replacementCoversData) {
            curRepairs.push(replacementCoversData[entry].repairId)
        }
    }

    // Rename the retrieved repairs for specificity later
    let repairs = repairData

    // Create array of the cover type options to be used in the FormSelectInput component
    let coverTypeOptions =  [{"display": "Full Bound", "store": CoverType.FULL}, {"display": "Quarter Bound", "store": CoverType.QUARTER}, {"display": "Three Quarter Bound", "store": CoverType.THREEQUARTER}]

    // Create array of the cover material options to be used in the FormSelectInput component
    let coverMaterialOptions =  [{"display": "Buckram", "store": CoverMaterial.BUCKRAM}, {"display": "Book Cloth", "store": CoverMaterial.BOOKCLOTH}, {"display": "Leather", "store": CoverMaterial.LEATHER}] 

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
            const body = { coverType, spineMaterial, sideMaterial, repairId }
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
        setCoverType('')
        setSpineMaterial('')
        setSideMaterial('')
        setRepairId('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormSelectInput onChange={(value) => setCoverType(value)} input={ coverType } inputId={ "Cover Type" } options={ coverTypeOptions } displayKey={ "display"} storeKey={ "store" }/>

                <FormSelectInput onChange={(value) => setSpineMaterial(value)} input={ spineMaterial } inputId={ "Spine Material" } options={ coverMaterialOptions } displayKey={ "display"} storeKey={ "store" }/>

                <FormSelectInput onChange={(value) => setSideMaterial(value)} input={ sideMaterial } inputId={ "Side Material" } options={ coverMaterialOptions } displayKey={ "display"} storeKey={ "store" }/>

                <FormSelectInput onChange={(value) => setRepairId(value)} input={ repairId } inputId={ "Repair" } options={ repairs } displayKey={ "id"} storeKey={ "id" } uniquesArray={ curRepairs }/>

                <FormSubmitButton requiredInputs={ [repairId] }/>
                <FormCancelButton clearInvalids={() => clearErrors()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}