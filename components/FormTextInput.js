import React from 'react'
import FormInputErrorMessage from './FormInputErrorMessage'

export default function FormTextInput({ onChange, placeholder, input, values, inputId, constraints, errorMessage }) {
    let idError, idField

    const renderInvalid = () => {
        idError.classList.remove("invisible")
        idError.classList.add("visible")

        idField.classList.remove("border-slate-900")
        idField.classList.remove("focus:border-sky-400")
        idField.classList.add("border-red-400")
    }

    const renderValid = () => {
        idError.classList.remove("visible")
        idError.classList.add("invisible")
        
        idField.classList.remove("border-red-400")
        idField.classList.add("border-slate-900")
        idField.classList.add("focus:border-sky-400")
    }

    const checkDate = text => {
        if ((text.length == 1) && text.match(/^\d$/)) return text
        else if ((text.length == 2) && text.match(/^\d\d$/)) {
            text += ' - '
            return text
        }
        else if (text.length == 4)  {
            text = text.slice(0, -3)
            return text
        }
        else if (text.length == 5) return text
        else if ((text.length == 6) && text.match(/^\d\d - \d$/)) return text
        else if ((text.length == 7) && text.match(/^\d\d - \d\d$/)) {
            text += ' - '
            return text
        }
        else if (text.length == 9)  {
            text = text.slice(0, -3)
            return text
        }
        else if (text.length == 10) return text
        else if ((text.length >= 11) && (text.length <= 14) && text.match(/^\d\d - \d\d - \d{1,4}$/)) return text
        else {
            return null
        }
    }

    const checkThisInput = async text => {
        idError = document.getElementById(inputId + "Error")
        idField = document.getElementById(inputId)

        if (constraints.length == 0) onChange(text)
        if (constraints.includes("unique")) {
            if (values.includes(text)) {
                renderInvalid()
            }
            else {
                renderValid()
            }
            onChange(text)
        }
        if (constraints.includes("int")) {
            if (!text.match(/^\d*$/)) {
                renderInvalid()
            }
            else {
                renderValid()
                onChange(text)
            }
        }
        if (constraints.includes("date")) {
            let date = checkDate(text)
            if (!date && (text != '')) {
                renderInvalid()
            }
            else {
                renderValid()
                onChange(date)
            }
        }
        if (constraints.includes("money")) {
            if (text.match(/^\.$/)) {
                text = '0.'
                onChange(text)
            }
            else if (!text.match(/^\d*\.?\d{0,2}$/)) {
                renderInvalid()
            }
            else {
                renderValid()
                onChange(text)
            }
        }
    }

    return (
        <div>
            <label>{ inputId }</label>
            <input
                className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 valid input"
                onChange={e => checkThisInput(e.target.value)}
                placeholder={ placeholder }
                type="text"
                value={ input }
                id={ inputId }
            />
            <FormInputErrorMessage id={ inputId + "Error" } text={ errorMessage }/>
        </div>
    )
}