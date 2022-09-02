import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSelectInput from './FormSelectInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'
import { BindingType } from '@prisma/client'

/**
 * 
 * @returns HTML form for adding a book to the database, along with submit and cancel buttons
 */
export default function AddBookForm() {

    // Create state for the attributes of a book
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [publisher, setPublisher] = useState('')
    const [yearPublished, setYearPublished] = useState('')
    const [numberOfPages, setNumberOfPages] = useState('')
    const [bindingType, setBindingType] = useState('')
    const [received, setReceived] = useState('')
    const [returned, setReturned] = useState('')
    const [bookMaterialsCost, setBookMaterialsCost] = useState('')
    const [amountCharged, setAmountCharged] = useState('')
    const [ownerId, setOwnerId] = useState('')

    // Create state for determining the validity of a date;
    // Changed in the FormTextInput component where the constraint "date" is provided
    // and passed via function through the optional parameter isDateValid
    const [receivedValid, setReceivedValid] = useState(false)
    const [returnedValid, setReturnedValid] = useState(false)

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data, error } = useSWR('/api/owners')
    if (error) return <div>{ error }</div>
    if (!data) return <div>Loading...</div>

    // Rename the retrieved owners for specificity later
    let owners = data

    // Create array of the binding type options to be used in the FormSelectInput component
    let bindingTypeOptions =  [{"display": "Sewn", "store": BindingType.SEWN}, {"display": "Perfect", "store": BindingType.PERFECT}]

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {*} e The event provided when the submit button is pressed
     */
    const submitData = async e => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            // Don't submit id because of default creation by the database
            const body = { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }
            await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/books')
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * Clear all the formatting for showing errors in the form
     */
    const clearErrors = () => {
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
    }

    /**
     * Clear all the form inputs
     */
    const cancelInputs = () => {
        setTitle('')
        setAuthor('')
        setPublisher('')
        setYearPublished('')
        setNumberOfPages('')
        setBindingType('')
        setReceived('')
        setReturned('')
        setBookMaterialsCost('')
        setAmountCharged('')
        setOwnerId('')

        setReceivedValid(false)
        setReturnedValid(false)
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                
                <FormTextInput
                    onChange={(value) => setTitle(value)}
                    placeholder={ "'The Divine Comedy'" }
                    input={ title }
                    inputId={ "Title" }
                />

                <FormTextInput
                    onChange={(value) => setAuthor(value)}
                    placeholder={ "'Dante Alighieri'" }
                    input={ author }
                    inputId={ "Author" }
                />

                <FormTextInput
                    onChange={(value) => setPublisher(value)}
                    placeholder={ "'Doubleday & Company, Inc'" }
                    input={ publisher }
                    inputId={ "Publisher" }
                />

                <FormTextInput
                    onChange={(value) => setYearPublished(value)}
                    placeholder={ "'1946'" }
                    input={ yearPublished }
                    inputId={ "Year Published" }
                    constraints={ ["int"] }
                    errorMessage={ "Please only enter a number here." }
                />

                <FormTextInput
                    onChange={(value) => setNumberOfPages(value)}
                    placeholder={ "'475'" }
                    input={ numberOfPages }
                    inputId={ "Number of Pages" }
                    constraints={ ["int"] }
                    errorMessage={ "Please only enter a number here." }
                />

                <FormSelectInput
                    onChange={(value) => setBindingType(value)}
                    input={ bindingType }
                    inputId={ "Binding Type" }
                    options={ bindingTypeOptions }
                    displayKey={ "display"}
                    storeKey={ "store" }
                />

                <FormTextInput
                    onChange={(value) => setReceived(value)}
                    placeholder={ "'01 - 18 - 2017'" }
                    input={ received }
                    inputId={ "Date Received" }
                    constraints={ ["date"] }
                    errorMessage={ "Sorry, but that's not a real date." }
                    dateIsValid={(validity) => setReceivedValid(validity)}
                />

                <FormTextInput
                    onChange={(value) => setReturned(value)}
                    placeholder={ "'03 - 28 - 2017'" }
                    input={ returned }
                    inputId={ "Date Returned" }
                    constraints={ ["date"] }
                    errorMessage={ "Sorry, but that's not a real date." }
                    dateIsValid={(validity) => setReturnedValid(validity)}
                />

                <FormTextInput
                    onChange={(value) => setBookMaterialsCost(value)}
                    placeholder={ "'14.89'" }
                    input={ bookMaterialsCost }
                    inputId={ "Materials Cost" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                />

                <FormTextInput
                    onChange={(value) => setAmountCharged(value)}
                    placeholder={ "'50.00'" }
                    input={ amountCharged }
                    inputId={ "Amount Charged" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                />

                <FormSelectInput
                    onChange={(value) => setOwnerId(value)}
                    input={ ownerId }
                    inputId={ "Owner" }
                    options={ owners }
                    displayKey={ "ownerName"}
                    storeKey={ "id" }
                />

                <FormSubmitButton
                    requiredInputs={ [title, author, bindingType, received, ownerId] }
                    requiredDates={ [receivedValid ]}
                    dateValids={ [receivedValid, returnedValid] }
                />
                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </div>
    )
}