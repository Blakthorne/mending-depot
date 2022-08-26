import React from 'react'

export default function FormInputErrorMessage({ id, text }) {
    return (
        <div
            id={ id }
            className="w-full pt-0 pb-4 text-xs text-red-300 invisible errorMessage">
            { text }
        </div>
    )
}