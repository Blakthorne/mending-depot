import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import FormSelectInput from './FormSelectInput'
import { Unit } from '@prisma/client'

/**
 * 
 * @returns HTML form for adding a material to the database, along with submit and cancel buttons
 */
export default function AddMaterialForm() {

    // Create state for the attributes of a repair
    const [materialName, setMaterialName] = useState('')
    const [units, setUnits] = useState('')
    const [unitCost, setUnitCost] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Stores the names of the owners to be used in the
    // uniqueness check of the FormSubmitButton component
    let materials = []

    // Retrieve the owners for use in the materials[] for the uniqueness check
    const { data, error } = useSWR('/api/materials')
    if (error) return <div>{ error }</div>
    if (!data) return <div>Loading...</div>
    else {
        // Extract all the names of the materials
        for (const entry in data) {
            materials.push(data[entry].materialName)
        }
    }

    // Create array of the unit options to be used in the FormSelectInput component
    let unitOptions =  [{"display": "Inches", "store": Unit.INCHES}, {"display": "Inches Squared", "store": Unit.INCHESSQUARED}, {"display": "Centimeters", "store": Unit.CENTIMETERS}, {"display": "Centimeters Squared", "store": Unit.CENTIMETERSSQUARED}] 

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
            const body = { materialName, units, unitCost }
            await fetch('/api/materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/materials')
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
        setMaterialName('')
        setUnits('')
        setUnitCost('')
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormTextInput onChange={(value) => setMaterialName(value)} placeholder={ "'Japanese Paper'" } input={ materialName } inputId={ "Material Name" } uniquesArray={ materials } constraints={ ["unique"] } errorMessage={ "That material already exists. Please enter a new material." }/>

                <FormSelectInput onChange={(value) => setUnits(value)} input={ units } inputId={ "Units" } options={ unitOptions } displayKey={ "display"} storeKey={ "store" }/>

                <FormTextInput onChange={(value) => setUnitCost(value)} placeholder={ "'3.79'" } input={ unitCost } inputId={ "Unit Cost" } constraints={ ["money"] } errorMessage={ "Please only enter a dollar value here." }/>

                <FormSubmitButton requiredInputs={ [materialName, units, unitCost] }/>
                <FormCancelButton clearInvalids={() => clearErrors()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}