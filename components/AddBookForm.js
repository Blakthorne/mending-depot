import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import FormTextInput from './FormTextInput'
import FormSelectInput from './FormSelectInput'
import FormSubmitButton from './FormSubmitButton'
import FormCancelButton from './FormCancelButton'

export default function AddBookForm() {

    const { data, error } = useSWR('/api/owners')
    if (error) return <div>{ error }</div>

    const { mutate } = useSWRConfig('')
    
    const [bookTitle, setBookTitle] = useState('')
    const [bookAuthor, setBookAuthor] = useState('')
    const [bookPublisher, setBookPublisher] = useState('')
    const [bookYearPublished, setBookYearPublished] = useState('')
    const [bookNumPages, setBookNumPages] = useState('')
    const [bookBindingType, setBookBindingType] = useState('')
    const [bookReceived, setBookReceived] = useState('')
    const [bookReturned, setBookReturned] = useState('')
    const [bookMaterialsCost, setBookMaterialsCost] = useState('')
    const [bookAmountCharged, setBookAmountCharged] = useState('')
    const [bookOwner, setBookOwner] = useState('')

    const [bookReceivedValid, setBookReceivedValid] = useState(false)
    const [bookReturnedValid, setBookReturnedValid] = useState(false)

    const submitData = async e => {
        e.preventDefault()
        try {
            const body = { bookTitle, bookAuthor, bookPublisher, bookYearPublished, bookNumPages, bookBindingType, bookReceived, bookReturned, bookMaterialsCost, bookAmountCharged, bookOwner }
            await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            cancelInputs()
            clear()
            mutate('/api/books')
        } catch (error) {
            console.error(error)
        }
    }

    const clear = () => {
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

    const cancelInputs = () => {
        setBookTitle('')
        setBookAuthor('')
        setBookPublisher('')
        setBookYearPublished('')
        setBookNumPages('')
        setBookBindingType('')
        setBookReceived('')
        setBookReturned('')
        setBookMaterialsCost('')
        setBookAmountCharged('')
        setBookOwner('')

        setBookReceivedValid(false)
        setBookReturnedValid(false)

        clear()        
    }

    return (
        <div className="mt-16">
            <form
                autoComplete="off"
                onSubmit={submitData}>
                <FormTextInput onChange={(value) => setBookTitle(value)} placeholder={ "'The Divine Comedy'" } input={ bookTitle } inputId={ "Title" } constraints={ [] }/>

                <FormTextInput onChange={(value) => setBookAuthor(value)} placeholder={ "'Dante Alighieri'" } input={ bookAuthor } inputId={ "Author" } constraints={ [] }/>

                <FormTextInput onChange={(value) => setBookPublisher(value)} placeholder={ "'Doubleday & Company, Inc'" } input={ bookPublisher } inputId={ "Publisher" } constraints={ [] }/>

                <FormTextInput onChange={(value) => setBookYearPublished(value)} placeholder={ "'1946'" } input={ bookYearPublished } inputId={ "Year Published" } constraints={ ["int"] } errorMessage={ "Please only enter a number here." }/>

                <FormTextInput onChange={(value) => setBookNumPages(value)} placeholder={ "'475'" } input={ bookNumPages } inputId={ "Number of Pages" } constraints={ ["int"] } errorMessage={ "Please only enter a number here." }/>

                <FormSelectInput onChange={(value) => setBookBindingType(value)} input={ bookBindingType } inputId={ "Binding Type" } options={ [{"type": "Sewn"}, {"type": "Perfect"}] } displayKey={ "type"} storeKey={ "type" }/>

                <FormTextInput onChange={(value) => setBookReceived(value)} placeholder={ "'01-18-2017'" } input={ bookReceived } inputId={ "Date Received" } constraints={ ["date"] } errorMessage={ "Sorry, but that's not a real date." } dateIsValid={(validity) => setBookReceivedValid(validity)}/>

                <FormTextInput onChange={(value) => setBookReturned(value)} placeholder={ "'03-28-2017'" } input={ bookReturned } inputId={ "Date Returned" } constraints={ ["date"] } errorMessage={ "Sorry, but that's not a real date." } dateIsValid={(validity) => setBookReturnedValid(validity)}/>

                <FormTextInput onChange={(value) => setBookMaterialsCost(value)} placeholder={ "'14.89'" } input={ bookMaterialsCost } inputId={ "Materials Cost" } constraints={ ["money"] } errorMessage={ "Please only enter a dollar value here." }/>

                <FormTextInput onChange={(value) => setBookAmountCharged(value)} placeholder={ "'50.00'" } input={ bookAmountCharged } inputId={ "Amount Charged" } constraints={ ["money"] } errorMessage={ "Please only enter a dollar value here." }/>

                <FormSelectInput onChange={(value) => setBookOwner(value)} input={ bookOwner } inputId={ "Owner" } options={ data } displayKey={ "ownerName"} storeKey={ "ownerId" }/>

                <FormSubmitButton requiredInputs={ [bookTitle, bookAuthor, bookBindingType, bookReceived, bookReceivedValid, bookOwner] } dateValids={ [bookReceivedValid, bookReturnedValid] }/>
                <FormCancelButton clearInvalids={() => clear()} cancelClick={() => cancelInputs()}/>
            </form>
        </div>
    )
}