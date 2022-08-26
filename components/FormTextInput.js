import React from 'react'

export default function FormTextInput({ onChange, placeholder, input, values, id }) {

    const checkThisInput = async text => {
        const idExists = document.getElementById(id + "Error")
        const idField = document.getElementById(id)
        if (values.includes(text)) {
            idExists.classList.remove("invisible")
            idExists.classList.add("visible")

            idField.classList.remove("border-slate-900")
            idField.classList.remove("focus:border-sky-400")
            idField.classList.add("border-red-400")
        }
        else {
            idExists.classList.remove("visible")
            idExists.classList.add("invisible")
            
            idField.classList.remove("border-red-400")
            idField.classList.add("border-slate-900")
            idField.classList.add("focus:border-sky-400")
        }
        onChange(text)
    }

    return (
        <div>
            <label>{ id }</label>
            <input
                className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 valid input"
                onChange={e => checkThisInput(e.target.value)}
                placeholder={ placeholder }
                type="text"
                value={ input }
                id={ id }
            />
        </div>
    )
}