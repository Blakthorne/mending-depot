import React from 'react'

export default function FormSelectInput({ onChange, placeholder, input, inputId, options }) {
    return (
        <div>
            <label>{ inputId }</label>
            <select
                className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 valid input"
                onChange={e => onChange(e.target.value)}
                placeholder={ placeholder }
                type="text"
                value={ input }
                id={ inputId }
                default=''
            >
                <option hidden selected value></option>
                {options.map(option => (
                    <option value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}