import React from 'react'

type FormSubmitButtonComponent = {
    requiredInputs?: string[];
    requiredDates?: boolean[];
    dateValids?: boolean[];
    uniques?: object[];
    text: string;
}

/**
 * 
 * @param {string[]} [requiredInputs] Optional - The list of state variables which must have been filled out to submit the form
 * @param {boolean[]} [requiredDates] Optional - The list of boolean date state variables which must be "true" to submit the form
 * @param {boolean[]} [dateValids] Optional - The list of boolean date state variables which must be "true" to submit the form
 * @param {object[]} [uniques] Optional - The list of objects where key = state variable to check against values = array of values from the database
 * @param {string} text The to be displayed in the submit button
 * @returns HTML submit button
 */
export default function FormSubmitButton({ requiredInputs, requiredDates, dateValids, uniques, text }: FormSubmitButtonComponent) {

    /**
     * Determines whether the submit button should be disabled
     * 
     * @returns true if button should be disabled, false if should not be disabled
     */
    const disable = (): boolean => {

        // If the requiredInputs parameter is passed to the component,
        // iterate through the array and return true if any state variable in the array is empty
        if (requiredInputs) {
            for (let i = 0; i < requiredInputs.length; ++i) {
                if (!requiredInputs[i]) return true
            }
        }

        // If the dateValids parameter is passed to the component,
        // iterate through the array and return true if --
        //      any state variable in the array is false and
        //      the state of the dateValid element is in the requiredDates parameter
        if (dateValids) {
            for (let i = 0; i < dateValids.length; ++i) {
                if (dateValids[i] === false && requiredDates.includes(dateValids[i])) return true
            }
        }

        // If the uniques parameter is passed to the component,
        // iterate through the array and return true if the value of the state variable stored in the
        // key of the object appears in the array stored in the values of the object
        if (uniques) {
            for (let i = 0; i < uniques.length; ++i) {
                if (uniques[i]["values"].includes(uniques[i]["key"])) return true
            }
        }

        // Return false if there is no reason to disable the button
        return false
    }

    return (
        <button
            disabled={disable()}
            className="bg-slate-800 hover:bg-slate-700 py-2 px-4 shadow-sm shadow-slate-800 disabled:shadow-none disabled:bg-slate-600"
            type="submit"
        >
            {text}
        </button>
    )
}