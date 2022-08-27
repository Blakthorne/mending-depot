import React from 'react'

export default function FormCancelButton({ clearInvalids, cancelClick }) {

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