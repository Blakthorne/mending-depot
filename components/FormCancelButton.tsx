import React from 'react'

type FormCancelButtonComponent = {
    clearInvalids: () => void;
    cancelClick: () => void;
}

/**
 * 
 * @param {() => void} clearInvalids The function to clear form errors in the parent component
 * @param {() => void} cancelClick The function to clear form inputs in the parent component
 * @returns HTML cancel button
 */
export default function FormCancelButton({ clearInvalids, cancelClick }: FormCancelButtonComponent) {

    /**
     * Calls both the {@link clearInvalids} and {@link cancelClick} passed by the parent component
     */
    const onClick = (): void => {
        clearInvalids()
        cancelClick()
    }

    return (
        <input
            className="ml-4 text-gray-400"
            onClick={() => onClick()}
            value="or Cancel"
            type="button"
        />
    )
}