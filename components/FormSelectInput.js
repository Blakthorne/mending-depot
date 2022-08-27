import React from 'react'

export default function FormSelectInput({ onChange, input, inputId, options, displayKey, storeKey }) {
    let displayOptions = []
    if (options) {
        options.map(option => (
            displayOptions.push(option[displayKey])
        ))
    }
    return (
        <div>
            <label>{ inputId }</label>
            <select
                className="shadow shadow-slate-700 rounded w-full p-2 my-2 border border-slate-900 focus:outline-none focus:border-sky-400 valid input"
                onChange={e => onChange(e.target.value)}
                value={ input }
                id={ inputId }
            >
                <option hidden></option>
                {options ? options.map(selectOption => (
                    <option key={selectOption[storeKey]} value={selectOption[storeKey]}>{selectOption[displayKey]}</option>
                )) : 'None Available'}
                
            </select>
        </div>
    )
}