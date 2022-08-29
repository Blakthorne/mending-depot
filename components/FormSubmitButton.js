import React from 'react'

/**
 * 
 * @param {Array} [requiredInputs] The list of state variables which must have been filled out to submit the form
 * @param {Array} [dateValids] The list of boolean date state variables which must be "true" to submit the form
 * @param {Array} [uniques] The list of objects where key = state variable to check against values = array of values from the database
 * @returns HTML submit button
 */
export default function FormSubmitButton({ requiredInputs, dateValids, uniques }) {

    /**
     * Determines whether the submit button should be disabled
     * 
     * @returns true if button should be disabled, false if should not be disabled
     */
    const disable = () => {

        // If the requiredInputs parameter is passed to the component,
        // iterate through the array and return true if any state variable in the array is empty
        if (requiredInputs) {
            for (let i = 0; i < requiredInputs.length; ++i) {
                if (!requiredInputs[i]) return true
            }
        }

        // If the dateValids parameter is passed to the component,
        // iterate through the array and return true if any state variable in the array is false
        if (dateValids) {
            for (let i = 0; i < dateValids.length; ++i) {
                if (dateValids[i] == false && requiredInputs.includes(dateValids[i])) return true
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
            >Save Changes</button>
    )
}