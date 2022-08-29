import React, { useState } from 'react'
import FormInputErrorMessage from './FormInputErrorMessage'

/**
 * 
 * @param {function} onChange The function to call in the parent component upon user entry into the input element
 * @param {string} placeholder The placeholder text to display in the input element
 * @param {string} input Allows state changes from the parent (e.g. in the clear() function) to propagate
 * @param {string} inputId For the HTML element id and the form element label
 * @param {Array} [uniquesArray] Optional - The list of values against which to check new input to enforce uniqueness when required
 * @param {Array} [constraints] Optional - The list of strings representing the constraints on the input
 * @param {string} [errorMessage] Optional - The error message to display to the user when there is something wrong with the input
 * @param {function} [dateIsValid] Optional - The function to call in the parent component upon change of date to valid or invalid
 * @returns HTML input of type "text" with label and FormInputErrorMessage component
 */
export default function FormTextInput({ onChange, placeholder, input, inputId, uniquesArray, constraints, errorMessage, dateIsValid }) {

    // Create state for keeping track of whether a date is valid;
    // Used for rendering a date input valid or invalid when its at full length
    // based on what it was last rendered as
    const [privateDateValid, setPrivateDateValid] = useState(false)

    // Used for rendering error messages
    let idError, idField

    /**
     * Make the error message in the created in the {@link FormInputErrorMessage} component visible and
     * make the border of the input element red to indicate an error
     */
    const renderInvalid = () => {
        idError.classList.remove("invisible")
        idError.classList.add("visible")

        idField.classList.remove("border-slate-900")
        idField.classList.remove("focus:border-sky-400")
        idField.classList.add("border-red-400")
    }

    /**
     * Make the error message in the created in the {@link FormInputErrorMessage} component invisible and
     * revert the border of the input element back to its original state
     */
    const renderValid = () => {
        idError.classList.remove("visible")
        idError.classList.add("invisible")
        
        idField.classList.remove("border-red-400")
        idField.classList.add("border-slate-900")
        idField.classList.add("focus:border-sky-400")
    }

    /**
     * Set the {@link privateDateValid} state and call the {@link dateIsValid} function in the parent component based on the {@link valid} parameter
     * 
     * @param {boolean} valid true if date should be rendered as valid, false if should rendered as false
     */
    const renderDateValid = valid => {
        setPrivateDateValid(valid)
        dateIsValid(valid)
    }

    /**
     * Check the input date string against various regexs to ensure validity
     * 
     * @param {string} text The new entry in the input to check
     * @returns Either string passed in the text parameter without mutation or null
     */
    const checkStringDate = text => {
        if (text.length == 0) return text
        else if ((text.length == 1) && text.match(/^\d$/)) return text
        else if ((text.length == 2) && text.match(/^\d\d$/)) {
            text += ' - '
            return text
        }
        else if (text.length == 4)  {
            text = text.slice(0, -3)
            return text
        }
        else if (text.length == 5) return text
        else if ((text.length == 6) && text.match(/^\d\d - \d$/)) return text
        else if ((text.length == 7) && text.match(/^\d\d - \d\d$/)) {
            text += ' - '
            return text
        }
        else if (text.length == 9)  {
            text = text.slice(0, -3)
            return text
        }
        else if (text.length == 10) return text
        else if ((text.length >= 11) && (text.length <= 14) && text.match(/^\d\d - \d\d - \d{1,4}$/)) return text
        else if (text.length == 15 && text.match(/^\d\d - \d\d - \d\d\d\d.$/)) return text
        else {
            return null
        }
    }

    /**
     * Perform date validation operations based on the string returned from {@link checkStringDate}
     * 
     * @param {string} stringDate 
     */
    const renderDate = stringDate => {
        if (stringDate.length == 14) {
            let date = new Date(stringDate.slice(10) + '/' + stringDate.slice(0, 2) + '/' + stringDate.slice(5, 7))
            if (isNaN(date)) {
                renderDateValid(false)
                renderInvalid()
            }
            else {
                renderDateValid(true)
                renderValid()
            }
            onChange(stringDate)
        }
        else if (stringDate.length == 15) {
            if (privateDateValid == true) {
                renderDateValid(true)
                renderValid()
            }
            else {
                renderDateValid(false)
                renderInvalid()
            }
            
        }
        else {
            renderDateValid(false)
            renderValid()
            onChange(stringDate)
        }
    }

    /**
     * Check the new input based on the elements in the {@link constraints} array
     * 
     * @param {string} text The new text entered by the user
     */
    const checkThisInput = async text => {

        // Get the id's of the input element and error message element
        idError = document.getElementById(inputId + "Error")
        idField = document.getElementById(inputId)

        // Immediately update the text if no constraints were provided
        if (!constraints) onChange(text)
        else {
            if (constraints.includes("unique")) {
                let tempText = text.toLowerCase()
                if (uniquesArray.includes(tempText)) {
                    renderInvalid()
                }
                else {
                    renderValid()
                }
                onChange(text)
            }
            if (constraints.includes("int")) {
                if (text.match(/^\d*$/)) onChange(text)
            }
            if (constraints.includes("date")) {
                let stringDate = checkStringDate(text)
                
                if (!stringDate && (text != '')) { }
                else renderDate(stringDate)
            }
            if (constraints.includes("money")) {
                if (text.match(/^\.$/)) {
                    text = '0.'
                    onChange(text)
                }
                else if (text.match(/^\d*\.?\d{0,2}$/)) onChange(text)
            }
        }
    }

    return (
        <div>
            <label>{ inputId }</label>
            <input
                className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 valid input"
                onChange={e => checkThisInput(e.target.value)}
                placeholder={ placeholder }
                type="text"
                value={ input }
                id={ inputId }
            />
            {!errorMessage ? <FormInputErrorMessage id={ inputId + "Error" } text={ "There is something wrong with your input." }/> : <FormInputErrorMessage id={ inputId + "Error" } text={ errorMessage }/>}
        </div>
    )
}