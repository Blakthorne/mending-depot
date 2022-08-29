import React from 'react'

/**
 * 
 * @param {function} clearInvalids The function to clear form errors in the parent component
 * @param {function} cancelClick The function to clear form inputs in the parent component
 * @returns HTML cancel button
 */
export default function FormCancelButton({ clearInvalids, cancelClick }) {

    /**
     * Calls both functions passed by the parent component
     */
    const onClick = () => {
        clearInvalids()
        cancelClick()
    }

    return (
        <input
            className="ml-4 text-slate-900"
            onClick={() => onClick()}
            value="or Cancel"
            type="button"
        />
    )
}