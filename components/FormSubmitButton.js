import React from 'react'

export default function FormSubmitButton({ requiredInputs, dateValids }) {

    const disable = () => {
        for (let i = 0; i < requiredInputs.length; ++i) {
            if (!requiredInputs[i]) return true
        }

        for (let i = 0; i < dateValids.length; ++i) {
            if (dateValids[i] == false && requiredInputs.includes(dateValids[i])) return true
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