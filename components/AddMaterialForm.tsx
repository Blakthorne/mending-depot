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
export default function AddMaterialForm() {

    // Create state for the attributes of a repair
    const [materialName, setMaterialName] = useState('')
    const [units, setUnits] = useState(undefined)
    const [unitCost, setUnitCost] = useState('')
    const [manufacturerId, setManufacturerId] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the manufacturers table to get the manufacturer names and ids to be used as the foreign key in the material table
    const { data: manufacturers, error } = useSWR<Manufacturer[], Error>('/api/manufacturers')
    if (error) console.log(error)

    // Create array of the unit options to be used in the FormSelectInput component
    let unitOptions =  [{"display": "Inches", "store": "INCHES"}, {"display": "Inches Squared", "store": "INCHESSQUARED"}, {"display": "Centimeters", "store": "CENTIMETERS"}, {"display": "Centimeters Squared", "store": "CENTIMETERSSQUARED"}] 

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
            const body: Material = { materialName, units, unitCost, manufacturerId }
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
        setMaterialName('')
        setUnits('')
        setUnitCost('')
        setManufacturerId('')
    }

    return (
        <div className="mt-16 w-96">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >

                <FormTextInput
                    onChange={(value) => setMaterialName(value)}
                    placeholder={ "'Archival Tape P'" }
                    input={ materialName }
                    inputId={ "Material Name" }
                    required={ true }
                />

                <FormSelectInput
                    onChange={(value) => setUnits(value)}
                    input={ units }
                    inputId={ "Units" }
                    options={ unitOptions }
                    displayKey={ "display"}
                    storeKey={ "store" }
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setUnitCost(value)}
                    placeholder={ "'3.00'" } input={ unitCost }
                    inputId={ "Unit Cost" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                    required={ true }
                />

                <FormSelectInput
                    onChange={(value) => setManufacturerId(value)}
                    input={ manufacturerId }
                    inputId={ "Manufacturer" }
                    options={ manufacturers }
                    displayKey={ "manufacturerName"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [materialName, units, unitCost, manufacturerId] }
                    text="Add Material"
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}