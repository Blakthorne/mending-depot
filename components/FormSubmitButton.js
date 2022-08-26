import React from 'react'

export default function FormSubmitButton({ inputs, uniques }) {

    const disable = () => {
        for (let i = 0; i < inputs.length; ++i) {
            if (!inputs[i]) return true
        }

        for (let i = 0; i < uniques.length; ++i) {
            if (uniques[i]["values"].includes(uniques[i]["key"])) return true
        }
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