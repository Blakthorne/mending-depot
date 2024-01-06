type FormInputErrorMessageComponent = {
    id: string;
    text: string;
}

/**
 * 
 * @param {string} id The id of the error message element
 * @param {string} text The error message to display 
 * @returns HTML error message
 */
export default function FormInputErrorMessage({ id, text }: FormInputErrorMessageComponent) {
    return (
        <div
            id={ id }
            className="w-full pt-0 pb-4 text-xs text-error invisible errorMessage">
            { text }
        </div>
    )
}