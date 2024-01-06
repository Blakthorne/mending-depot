'use client'
import useSWR, { useSWRConfig } from 'swr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FormTextInput from '../../../components/forms/FormTextInput'
import FormSelectInput from '../../../components/forms/FormSelectInput'
import FormSubmitButton from '../../../components/forms/FormSubmitButton'
import FormCancelButton from '../../../components/forms/FormCancelButton'
import FormLayout from '../../../components/forms/FormLayout'
import LoadingIcon from '../../../loading'

/**
 * 
 * @returns HTML form for editing an existing book in the database, along with submit and cancel buttons
 */
export default function EditBookForm({ bookId }) {

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
    const [id, setId] = useState('')

    // Create state for determining the validity of a date;
    // Changed in the FormTextInput component where the constraint "date" is provided
    // and passed via function through the optional parameter isDateValid
    const [receivedValid, setReceivedValid] = useState(false)
    const [returnedValid, setReturnedValid] = useState(false)

    const setInputs = (book: Book) => {
        setTitle(book.title)
        setAuthor(book.author)
        setPublisher(book.publisher)
        setYearPublished(book.yearPublished as string)
        setNumberOfPages(book.numberOfPages as string)
        setbindingTypeId(book.bindingTypeId)
        setReceived(book.received as string)
        setReturned(book.returned as string)
        setBookMaterialsCost(book.bookMaterialsCost as string)
        setAmountCharged(book.amountCharged as string)
        setOwnerId(book.ownerId)
        setId(book.id)

        setReceivedValid(true)
    }

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // For page refresh after form submission
    const router = useRouter()

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data: owners, error } = useSWR<Owner[], Error>('/api/owners')
    if (error) console.log(error)

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data: bindingTypes, error: bindingTypeError } = useSWR<BindingType[], Error>('/api/bindingtypes')
    if (bindingTypeError) console.log(bindingTypeError)

    // Retrieve the book entry that corresponds to the requested book id
    const { data: book, error: bookError } = useSWR<Book, Error>('/api/books/' + bookId)
    if (bookError) console.log(bookError)
    if (!book) {
        return (
            <LoadingIcon/>
        )
    }

    // Save the original copy of states so can revert back if user wants
    const oldTitle = book.title
    const oldAuthor = book.author
    const oldPublisher = book.publisher
    const oldYearPublished = book.yearPublished as string
    const oldNumberOfPages = book.numberOfPages as string
    const oldBindingTypeId = book.bindingTypeId
    const oldReceived = book.received as string
    const oldReturned = book.returned as string
    const oldBookMaterialsCost = book.bookMaterialsCost as string
    const oldAmountCharged = book.amountCharged as string
    const oldOwnerId = book.ownerId

    // Must set values to state below return statement above so it doesn't
    // render an infinite loop.
    // Only set if book is already defined, and
    // the id check is to make sure it still doesn't render in an infinite loop.
    // This is safe because `id` will never change since disabled.
    if (book && id === '') {
        setInputs(book)
    }

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
            const body: Book = { id, title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }
            const data = await fetch('/api/books', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const newBook: Book = await data.json()

            // Update the UI wherever this API call is referenced
            mutate('/api/books')
            mutate('/api/books/' + id)

            await fetch('/books/summary/revalidate/' + id)
            router.push("/books/summary/" + id)
        } catch (error) {
            console.error(error)
        }
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
        setTitle(oldTitle)
        setAuthor(oldAuthor)
        setPublisher(oldPublisher)
        setYearPublished(oldYearPublished)
        setNumberOfPages(oldNumberOfPages)
        setbindingTypeId(oldBindingTypeId)
        setReceived(oldReceived)
        setReturned(oldReturned)
        setBookMaterialsCost(oldBookMaterialsCost)
        setAmountCharged(oldAmountCharged)
        setOwnerId(oldOwnerId)

        setReceivedValid(true)
        setReturnedValid(false)
    }

    return (
        <FormLayout formTitle={"Edit '" + book.title + "'"}>
            <form
                autoComplete="off"
                onSubmit={(event) => submitData(event)}
            >
                <FormTextInput
                    onChange={(value) => setId(value)}
                    placeholder={ "" }
                    input={ id }
                    inputId={ "Book ID" }
                    required={ true }
                    isDisabled={ true }
                />

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
                    isDisabled={ true }
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
                    text={ "Submit Update" }
                />

                <FormCancelButton
                    clearInvalids={() => clearErrors()}
                    cancelClick={() => cancelInputs()}
                />
            </form>
        </FormLayout>
    )
}