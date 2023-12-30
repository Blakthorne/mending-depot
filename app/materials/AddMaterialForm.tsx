'use client'
import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from '../components/forms/FormTextInput'
import FormSubmitButton from '../components/forms/FormSubmitButton'
import FormCancelButton from '../components/forms/FormCancelButton'
import FormSelectInput from '../components/forms/FormSelectInput'

/**
 * 
 * @returns HTML form for adding a material to the database, along with submit and cancel buttons
 */
function AddMaterialForm() {

    // Create state for the attributes of a material
    const [materialName, setMaterialName] = useState('')
    const [unitTypeId, setUnitTypeId] = useState('')
    const [unitCost, setUnitCost] = useState('')
    const [manufacturerId, setManufacturerId] = useState('')

    // Create state for the material type form inputs
    const [materialTypesInputs, setMaterialTypeInputs] = useState([''])

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the manufacturers table to get the manufacturer names and ids to be used as the foreign key in the material table
    const { data: manufacturers, error: manufacturersError } = useSWR<Manufacturer[], Error>('/api/manufacturers')
    if (manufacturersError) console.log(manufacturersError)

    // Retrieve the material types table to get the material type names and ids to be used as a key in the material type table
    const { data: materialTypesData, error: materialTypesError } = useSWR<MaterialType[], Error>('/api/materialtypes')
    if (materialTypesError) console.log(materialTypesError)

    // Retrieve the unit types table to get the unit type names and ids to be used as a key in the unit type table
    const { data: unitTypesData, error: unitTypesError } = useSWR<MaterialType[], Error>('/api/unittypes')
    if (unitTypesError) console.log(unitTypesError)

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
    const submitData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            const body = { materialName, unitTypeId, unitCost, manufacturerId, materialTypesInputs }
            await fetch('/api/materials/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/materials')
            mutate('api/typesformaterials')
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
        setMaterialName('')
        setUnitTypeId('')
        setUnitCost('')
        setManufacturerId('')
        setMaterialTypeInputs([''])
    }

    /**
     * Add another input field for adding another material type associated with the material
     */
    const addAssociatedRepairInput = () => {
        setMaterialTypeInputs(materialTypes => [...materialTypes, ''])
    }

    /**
     * Update the materialTypesInputs state with new information selected by the user
     */
    const updateMaterialTypeInputs = (value, index) => {
        
        // Use the ellipses syntax to copy the array and tell React that the state reference has changed
        let curMaterialsArray = [...materialTypesInputs]

        curMaterialsArray[index] = value
        setMaterialTypeInputs(curMaterialsArray)
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
                    onChange={(value) => setUnitTypeId(value)}
                    input={ unitTypeId }
                    inputId={ "Unit Type" }
                    options={ unitTypesData }
                    displayKey={ "unitTypeName" }
                    storeKey={ "id" }
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

                {materialTypesInputs.map((input, index) => (
                    <FormSelectInput
                        onChange={(value) => updateMaterialTypeInputs(value, index)}
                        input={ input }
                        inputId={ "Associated Material Type" }
                        options={ materialTypesData }
                        displayKey={ "materialTypeName"}
                        storeKey={ "id" }
                        required={ true }
                        key={ String(index) }
                    />
                ))}
                
                <input
                    className="block mx-auto mb-12"
                    onClick={() => addAssociatedRepairInput()}
                    type="button"
                    value="Add Another Associated Material Type"
                />

                <FormSubmitButton
                    requiredInputs={ [materialName, unitTypeId, unitCost, manufacturerId] }
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