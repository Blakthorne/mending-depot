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
function AddMaterialForm() {

    // Create state for the attributes of a material
    const [materialName, setMaterialName] = useState('')
    const [units, setUnits] = useState(undefined)
    const [unitCost, setUnitCost] = useState('')
    const [manufacturerId, setManufacturerId] = useState('')

    // Create state for the repair type form inputs
    const [repairTypesInputs, setRepairTypeInputs] = useState([''])

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the manufacturers table to get the manufacturer names and ids to be used as the foreign key in the material table
    const { data: manufacturers, error: manufacturersError } = useSWR<Manufacturer[], Error>('/api/manufacturers')
    if (manufacturersError) console.log(manufacturersError)

    // Retrieve the repair types table to get the repair type names and ids to be used as a key in the material for repair type table
    const { data: repairTypesData, error: repairTypesError } = useSWR<RepairType[], Error>('/api/repairtypes')
    if (repairTypesError) console.log(repairTypesError)

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
            const body = { materialName, units, unitCost, manufacturerId, repairTypesInputs }
            await fetch('/api/materials/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/materials')
            mutate('api/materialforrepairtype')
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
        setRepairTypeInputs([''])
    }

    /**
     * Add another input field for adding another repair type associated with the material
     */
    const addAssociatedRepairInput = () => {
        setRepairTypeInputs(repairTypes => [...repairTypes, ''])
    }

    /**
     * Update the repairTypesInputs state with new information selected by the user
     */
    const updateRepairTypeInputs = (value, index) => {
        
        // Use the ellipses syntax to copy the array and tell React that the state reference has changed
        let curRepairsArray = [...repairTypesInputs]

        curRepairsArray[index] = value
        setRepairTypeInputs(curRepairsArray)
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

                {repairTypesInputs.map((input, index) => (
                    <FormSelectInput
                        onChange={(value) => updateRepairTypeInputs(value, index)}
                        input={ input }
                        inputId={ "Associated Repair Type" }
                        options={ repairTypesData }
                        displayKey={ "repairTypeName"}
                        storeKey={ "id" }
                        required={ true }
                        key={ String(index) }
                    />
                ))}
                
                <input
                    className="block mx-auto mb-12"
                    onClick={() => addAssociatedRepairInput()}
                    type="button"
                    value="Add Another Associated Repair Type"
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

export default AddMaterialForm