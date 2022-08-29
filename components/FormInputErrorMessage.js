import React from 'react'

/**
 * 
 * @param {string} id The id of the error message element
 * @param {string} text The error message to display 
 * @returns HTML error message
 */
export default function FormInputErrorMessage({ id, text }) {
    return (
        <div
            id={ id }
            className="w-full pt-0 pb-4 text-xs text-red-300 invisible errorMessage">
            { text }
        </div>
    )
}