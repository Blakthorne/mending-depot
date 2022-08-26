import React from 'react'

export default function FormCancelButton({ cancelClick }) {

    const onClick = () => {
        const errorMessages = document.getElementsByClassName("errorMessage")
        const inputs = document.getElementsByClassName("input")

        for (let i = 0; i < errorMessages.length; ++i) {
            errorMessages[i].classList.remove("visible")
            errorMessages[i].classList.add("invisible")
        }
        for (let i = 0; i < inputs.length; ++i) {
            inputs[i].classList.remove("border-red-400")
            inputs[i].classList.add("border-slate-900")
            inputs[i].classList.add("focus:border-sky-400")
        }
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