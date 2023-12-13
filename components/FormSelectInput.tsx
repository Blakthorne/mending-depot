import React from 'react'
import FormInputErrorMessage from './FormInputErrorMessage'

type FormSelectInputComponent = {
    onChange?: (e: string) => void;
    input: string;
    inputId: string;
    options?: object[];
    displayKey: string;
    storeKey: string;
    errorMessage?: string;
    uniquesArray?: string[];
    containts?: string[];
    required: boolean;
}

/**
 * 
 * @param {(e: string) => void} [onChange] Optional - The function to call in the parent component upon selection of an item
 * @param {string} input Allows state changes from the parent (e.g. in the clear() function) to propagate
 * @param {string} inputId For the HTML element id and the form element label
 * @param {object[]} [options] The database object retreived from the API for displaying the select input options
 * @param {string} displayKey The object key on which to display select options
 * @param {string} storeKey The object key on which to store select options
 * @param {string} [errorMessage] Optional - The error message to display to the user when there is something wrong with the input
 * @param {string[]} [uniquesArray] Optional - The list of values against which to check new input to enforce uniqueness when required
 * @param {string[]} [constraints] Optional - The list of strings representing the constraints on the input
 * @param {boolean} required True if input is required, false otherwise
 * @returns HTML input of type "select" with label and FormInputErrorMessage component
 */
export default function FormSelectInput({ onChange, input, inputId, options, displayKey, storeKey, errorMessage, uniquesArray, required }: FormSelectInputComponent) {

    // Define another array as null to hold the final options to display after filtering
    let finalOptions: object[] | null = null

    // Only filter if options was provided by the parent component
    if (options) {
        finalOptions = []

        // If uniquesArray was not provided by the parent component, no filtering is needed
        if (!uniquesArray) {
            finalOptions = options
        }
        else {

            // Iterate through the possible options to display
            for (let i = 0; i < options.length; ++i) {

                // If the value in the possible options is in the uniquesArray, don't display it
                if (!uniquesArray.includes(options[i][storeKey])) {
                    let newOption: object = {}
                    newOption[displayKey] =  options[i][storeKey]
                    finalOptions.push(newOption)
                }
            }

            // If there weren't any options added to finalOptions, reset it to null for display purposes
            if (finalOptions.length == 0) finalOptions = null
        }
    }

    return (
        <div>
            <label>
                { inputId }
                {required ?
                    <span className="text-accent"> *</span>
                    : <span></span>
                }
            </label>
            
            <select
                className="select select-bordered w-full my-2 focus:outline-none focus:border-info hover:border-base-content valid"
                onChange={e => onChange(e.target.value)}
                value={ input }
                id={ inputId }
            >
                <option hidden></option>
                {finalOptions !== null ? finalOptions.map(selectOption => (
                    <option
                        key={selectOption[storeKey]}
                        value={selectOption[storeKey]}
                    >
                        {selectOption[displayKey]}
                    </option>
                    )) : <option key={inputId + "None"} disabled>Nothing available</option>
                }
            </select>
            {!errorMessage ?
                <FormInputErrorMessage
                    id={ inputId + "Error" }
                    text={ "There is something wrong with your input." }
                />
                : <FormInputErrorMessage
                    id={ inputId + "Error" }
                    text={ errorMessage }/>
            }
        </div>
    )
}