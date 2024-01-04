'use client'
import useSWR, { useSWRConfig } from 'swr'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormTextInput from '../../components/forms/FormTextInput'
import FormSelectInput from '../../components/forms/FormSelectInput'
import FormSubmitButton from '../../components/forms/FormSubmitButton'
import FormCancelButton from '../../components/forms/FormCancelButton'

/**
 * 
 * @returns HTML form for adding a book to the database, along with submit and cancel buttons
 */
export default function AddBookForm({ buttonText = "Add Book"}) {

    // Create state for the attributes of a book
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [publisher, setPublisher] = useState('')
    const [yearPublished, setYearPublished] = useState('')
    const [numberOfPages, setNumberOfPages] = useState('')
    const [bindingTypeId, setbindingTypeId] = useState('')
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

    // Will be set after book submission
    // Used to redirect to new repair if desired by user
    const [newBookId, setNewBookId] = useState('')

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // Create an instance useRouter()
    // Used to redirect to new repair page
    const router = useRouter()

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data: owners, error } = useSWR<Owner[], Error>('/api/owners')
    if (error) console.log(error)

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data: bindingTypes, error: bindingTypeError } = useSWR<BindingType[], Error>('/api/bindingtypes')
    if (bindingTypeError) console.log(bindingTypeError)

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
    const submitData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        try {
            // Don't submit id because of default creation by the database
            const body: Book = { title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }
            const data = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const newBook: Book = await data.json()

            cancelInputs()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/books')

            setNewBookId(newBook.id)

            // I have to retype the element specifically as a Dialog Element or else TypeScript cries
            let elem: HTMLDialogElement = document.getElementById('my_modal_5') as HTMLDialogElement
            elem.showModal()
        } catch (error) {
            console.error(error)
        }
    }

    const redirectToNewRepair = () => {
        router.push('/new-repair/' + newBookId)
    }

    /**
     * Clear all the formatting for showing errors in the form
     */
    const clearErrors = (): void => {
        const errorMessages: HTMLCollection = document.getElementsByClassName("errorMessage")
        const inputs: HTMLCollection = document.getElementsByClassName("input")

        for (let i = 0; i < errorMessages.length; ++i) {
            errorMessages[i].classList.remove("visible")
            errorMessages[i].classList.add("invisible")
        }
        for (let i = 0; i < inputs.length; ++i) {
            inputs[i].classList.remove("focus:border-error")
            inputs[i].classList.add("focus:border-info")
        }
    }

    /**
     * Clear all the form inputs
     */
    const cancelInputs = (): void => {
        setTitle('')
        setAuthor('')
        setPublisher('')
        setYearPublished('')
        setNumberOfPages('')
        setbindingTypeId('')
        setReceived('')
        setReturned('')
        setBookMaterialsCost('')
        setAmountCharged('')
        setOwnerId('')

        setReceivedValid(false)
        setReturnedValid(false)
    }

    return (
        <div className="mt-16 mb-32">
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >
                
                <FormTextInput
                    onChange={(value) => setTitle(value)}
                    placeholder={ "'The Divine Comedy'" }
                    input={ title }
                    inputId={ "Title" }
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setAuthor(value)}
                    placeholder={ "'Dante Alighieri'" }
                    input={ author }
                    inputId={ "Author" }
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setPublisher(value)}
                    placeholder={ "'Doubleday & Company, Inc'" }
                    input={ publisher }
                    inputId={ "Publisher" }
                    required={ false }
                />

                <FormTextInput
                    onChange={(value) => setYearPublished(value)}
                    placeholder={ "'1946'" }
                    input={ yearPublished }
                    inputId={ "Year Published" }
                    constraints={ ["int"] }
                    errorMessage={ "Please only enter a number here." }
                    required={ false }
                />

                <FormTextInput
                    onChange={(value) => setNumberOfPages(value)}
                    placeholder={ "'475'" }
                    input={ numberOfPages }
                    inputId={ "Number of Pages" }
                    constraints={ ["int"] }
                    errorMessage={ "Please only enter a number here." }
                    required={ false }
                />

                <FormSelectInput
                    onChange={(value) => setbindingTypeId(value)}
                    input={ bindingTypeId }
                    inputId={ "Binding Type" }
                    options={ bindingTypes }
                    displayKey={ "bindingTypeName"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setReceived(value)}
                    placeholder={ "'01 - 18 - 2017'" }
                    input={ received }
                    inputId={ "Date Received" }
                    constraints={ ["date"] }
                    errorMessage={ "Sorry, but that's not a real date." }
                    dateIsValid={(validity) => setReceivedValid(validity)}
                    required={ true }
                />

                <FormTextInput
                    onChange={(value) => setReturned(value)}
                    placeholder={ "'03 - 28 - 2017'" }
                    input={ returned }
                    inputId={ "Date Returned" }
                    constraints={ ["date"] }
                    errorMessage={ "Sorry, but that's not a real date." }
                    dateIsValid={(validity) => setReturnedValid(validity)}
                    required={ false }
                />

                <FormTextInput
                    onChange={(value) => setBookMaterialsCost(value)}
                    placeholder={ "'14.89'" }
                    input={ bookMaterialsCost }
                    inputId={ "Materials Cost" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                    required={ false }
                />

                <FormTextInput
                    onChange={(value) => setAmountCharged(value)}
                    placeholder={ "'50.00'" }
                    input={ amountCharged }
                    inputId={ "Amount Charged" }
                    constraints={ ["money"] }
                    errorMessage={ "Please only enter a dollar value here." }
                    required={ false }
                />

                <FormSelectInput
                    onChange={(value) => setOwnerId(value)}
                    input={ ownerId }
                    inputId={ "Owner" }
                    options={ owners }
                    displayKey={ "ownerName"}
                    storeKey={ "id" }
                    required={ true }
                />

                <FormSubmitButton
                    requiredInputs={ [title, author, bindingTypeId, received, ownerId] }
                    requiredDates={ [receivedValid] }
                    dateValids={ [receivedValid, returnedValid] }
                    text={ buttonText }
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">It's Submitted!</h3>
                    <p className="pt-6">Do you want to go ahead and add some repairs to your new book?</p>
                    <div className="modal-action">
                    <form className="flex gap-4"
                          method="dialog">
                        <div className="btn btn-primary"
                             onClick={() => redirectToNewRepair()}>Sure</div>
                        <button className="btn btn-secondary">Nope</button>
                    </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}