import React from 'react'

type FormCancelButtonComponent = {
    clearInvalids: () => void;
    cancelClick: () => void;
    value?: string;
}

/**
 * 
 * @param {() => void} clearInvalids The function to clear form errors in the parent component
 * @param {() => void} cancelClick The function to clear form inputs in the parent component
 * @param {string} [value] Optional - The text to display for the cancel button
 * @returns HTML cancel button
 */
export default function FormCancelButton({ clearInvalids, cancelClick, value }: FormCancelButtonComponent) {

    // Set default text for the button if nothing is provided
    let stringValue: string = "or Cancel"

    if (value) stringValue = value;

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
            value={stringValue}
            type="button"
        />
    )
}