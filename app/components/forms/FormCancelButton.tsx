type FormCancelButtonComponent = {
    clearInvalids: () => void;
    cancelClick: () => void;
    value?: string;
    isAdjacent?: boolean;
}

/**
 * 
 * @param {() => void} clearInvalids The function to clear form errors in the parent component
 * @param {() => void} cancelClick The function to clear form inputs in the parent component
 * @param {string} [value] Optional - The text to display for the cancel button
 * @param {boolean} [isAdjacent] Optional - True if the text will be next to another button, False if not
 * @returns HTML cancel button
 */
export default function FormCancelButton({ clearInvalids, cancelClick, value, isAdjacent }: FormCancelButtonComponent) {

    // Set default text for the button if nothing is provided
    let stringValue: string = "or Cancel"

    // Display with a left margin if the Cancel button is sitting next to another item
    // Otherwise, center it
    let format: string = isAdjacent ? "text-base-content hover:text-secondary" : "ml-4 text-base-content hover:text-secondary"

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
            className={format}
            onClick={() => onClick()}
            value={stringValue}
            type="button"
        />
    )
}