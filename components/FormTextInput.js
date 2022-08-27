import React, { useState } from 'react'
import FormInputErrorMessage from './FormInputErrorMessage'

export default function FormTextInput({ onChange, placeholder, input, values, inputId, constraints, errorMessage, dateIsValid }) {
    let idError, idField
    const [privateDateValid, setPrivateDateValid] = useState(false)

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

    const renderDateValid = valid => {
        setPrivateDateValid(valid)
        dateIsValid(valid)
    }

    const checkStringDate = text => {
        if (text.length == 0) return text
        else if ((text.length == 1) && text.match(/^\d$/)) return text
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
        else if (text.length == 15 && text.match(/^\d\d - \d\d - \d\d\d\d.$/)) return text
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
            let stringDate = checkStringDate(text)
            
            if (!stringDate && (text != '')) {
                renderInvalid()
            }
            else {
                if (stringDate.length == 14) {
                    let date = new Date(stringDate.slice(10) + '/' + stringDate.slice(0, 2) + '/' + stringDate.slice(5, 7))
                    if (isNaN(date)) {
                        renderDateValid(false)
                        renderInvalid()
                    }
                    else {
                        renderDateValid(true)
                        renderValid()
                    }
                    onChange(stringDate)
                }
                else if (stringDate.length == 15) {
                    if (privateDateValid == true) {
                        renderDateValid(true)
                        renderValid()
                    }
                    else {
                        renderDateValid(false)
                        renderInvalid()
                    }
                    
                }
                else {
                    renderDateValid(false)
                    renderValid()
                    onChange(stringDate)
                }
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