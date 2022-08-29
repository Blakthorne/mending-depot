import React from 'react'
import FormInputErrorMessage from './FormInputErrorMessage'

/**
 * 
 * @param {function} onChange The function to call in the parent component upon selection of an item
 * @param {string} input Allows state changes from the parent (e.g. in the clear() function) to propagate
 * @param {string} inputId For the HTML element id and the form element label
 * @param {Object} options The database object retreived from the API for displaying the select input options
 * @param {string} displayKey The object key on which to display select options
 * @param {string} storeKey The object key on which to store select options
 * @param {string} [errorMessage] Optional - The error message to display to the user when there is something wrong with the input
 * @returns HTML input of type "select" with label and FormInputErrorMessage component
 */
export default function FormSelectInput({ onChange, input, inputId, options, displayKey, storeKey, errorMessage }) {
    return (
        <div>
            <label>{ inputId }</label>
            <select
                className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 valid input"
                onChange={e => onChange(e.target.value)}
                value={ input }
                id={ inputId }
            >
                <option hidden></option>
                {options ? options.map(selectOption => (
                    <option key={selectOption[storeKey]} value={selectOption[storeKey]}>{selectOption[displayKey]}</option>
                )) : 'None Available'}
            </select>
            {!errorMessage ? <FormInputErrorMessage id={ inputId + "Error" } text={ "There is something wrong with your input." }/> : <FormInputErrorMessage id={ inputId + "Error" } text={ errorMessage }/>}
        </div>
    )
}