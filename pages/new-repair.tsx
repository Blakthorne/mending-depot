import useSWR, { useSWRConfig } from 'swr'
import Head from 'next/head'
import React, { useState } from 'react'
import FormTextInput from '../components/FormTextInput'
import FormSelectInput from '../components/FormSelectInput'
import FormSubmitButton from '../components/FormSubmitButton'
import FormCancelButton from '../components/FormCancelButton'

type MaterialForRepairType = {
    repairTypeName: string;
    repairTypeId: string;
    materialName: string;
    materialId: string;
}

function If(props) {
    return props.condition ? <>{props.children}</> : null;
}

function NewRepair() {

    // Create state for stage of the new repair process
    const [stage, setStage] = useState('newRepairs')

    // Create state for the attributes of a book
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [publisher, setPublisher] = useState('')
    const [yearPublished, setYearPublished] = useState('')
    const [numberOfPages, setNumberOfPages] = useState('')
    const [bindingType, setBindingType] = useState(undefined)
    const [received, setReceived] = useState('')
    const [ownerId, setOwnerId] = useState('')

    // Changed in the FormTextInput component where the constraint "date" is provided
    // and passed via function through the optional parameter isDateValid
    const [receivedValid, setReceivedValid] = useState(false)
    const [returnedValid, setReturnedValid] = useState(false)

    // Create state for the repair type form inputs
    const [repairForms, setRepairForms] = useState([''])

    type RepairSpecsType = {
        [key: string]: string;
    }

    const tempObj: RepairSpecsType = {}

    const [repairSpecs, setRepairSpecs] = useState(tempObj)

    // Define variables empty strings for variables that won't be used in the form,
    // but still need to be submitted to the API
    const returned = ''
    const bookMaterialsCost = ''
    const amountCharged = ''

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    const fetcher = url => fetch(url).then(r => r.json())

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data: owners, error } = useSWR<Owner[], Error>('/api/owners', fetcher)
    if (error) console.log(error)

    // Retrieve the repairtypes table to get the repair type names and ids to be used as the foreign key in the repairs table
    const { data: repairTypes, error: repairTypesError } = useSWR<RepairType[], Error>('/api/repairtypes', fetcher)
    if (repairTypesError) console.log(repairTypesError)

    // Retrieve the materials for repair type readable table to get the repair type and material names for material selection
    const { data: materials, error: materialsError } = useSWR<object[], Error>('/api/materialforrepairtype/pairs', fetcher)
    if (materialsError) console.log(materialsError)

    // Create array of the binding type options to be used in the FormSelectInput component
    // with the format [{"display": "Sewn", "store": "SEWN"}, {"display": "Perfect", "store": "PERFECT"}]
    let bindingTypeOptions: object[] = []
    for (let curBindType of Object.values(BindingType)) {
        let curLowerBind = curBindType.toLowerCase()
        let curBindTypeObj: object = {"display": curLowerBind[0].toUpperCase() + curLowerBind.slice(1), "store": curBindType}

        bindingTypeOptions.push(curBindTypeObj)
    }

    // Create array of the cover type options to be used in the FormSelectInput component
    // with the format [{"display": "Full", "store": "FULL"}, {"display": "Quarter", "store": "QUARTER"}, etc.]
    let coverTypeOptions: object[] = []
    for (let curType of Object.values(CoverType)) {
        let curLower = curType.toLowerCase()
        let curTypeObj: object = {"display": curLower[0].toUpperCase() + curLower.slice(1), "store": curType}

        coverTypeOptions.push(curTypeObj)
    }

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
     const submitBookData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        setStage('newRepairs')

        // try {
        //     // Don't submit id because of default creation by the database
        //     const body: Book = { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }
        //     await fetch('/api/books', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(body),
        //     })
        //     cancelBookInputs()
        //     clearErrors()

        //     // Update the UI wherever this API call is referenced
        //     mutate('/api/books')
        // } catch (error) {
        //     console.error(error)
        // }
    }

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
     const submitNewRepairsData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()



        // try {
        //     // Don't submit id because of default creation by the database
        //     const body: Book = { title, author, publisher, yearPublished, numberOfPages, bindingType, received, returned, bookMaterialsCost, amountCharged, ownerId }
        //     await fetch('/api/books', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(body),
        //     })
        //     cancelBookInputs()
        //     clearErrors()

        //     // Update the UI wherever this API call is referenced
        //     mutate('/api/books')
        // } catch (error) {
        //     console.error(error)
        // }
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
            inputs[i].classList.remove("border-red-500")
            inputs[i].classList.add("border-gray-50")
            inputs[i].classList.add("focus:border-sky-400")
        }
    }

    /**
     * Clear the book form inputs
     */
    const cancelBookInputs = (): void => {
        setTitle('')
        setAuthor('')
        setPublisher('')
        setYearPublished('')
        setNumberOfPages('')
        setBindingType('')
        setReceived('')
        setOwnerId('')

        setReceivedValid(false)
        setReturnedValid(false)
    }

    /**
     * Remove the selected repair form
     */
     const cancelRepairForm = (repairNum: number): void => {

        // If there is only one form on the page, just blank out the option
        // If there is more than one form on the page, remove the selected form
        if (repairForms.length === 1) {
            setRepairForms([''])
        }
        else {
            let frontForms: string[] = repairForms.slice(0, repairNum)
            let backForms: string[] = repairForms.slice(repairNum + 1, undefined)

            frontForms = [...frontForms, ...backForms]

            setRepairForms(frontForms)
        }
    }

    /**
     * Add another input field for adding another repair associated with the book
     */
     const addRepairForm = (): void => {
        setRepairForms(repairForms => [...repairForms, ''])
    }

    /**
     * Update the repairTypesInputs state with new information selected by the user
     */
     const updateRepairTypeInputs = (value, index): void => {
        
        // Use the ellipses syntax to copy the array and tell React that the state reference has changed
        let curRepairsArray = [...repairForms]

        curRepairsArray[index] = value
        setRepairForms(curRepairsArray)
    }

    /**
     * Create a list containing only materials for the currently selected repair
     */
    const getMaterialsList = (repairTypeId: string): object[] => {
        if (materials) {
            return materials.filter((material: MaterialForRepairType) => material.repairTypeId === repairTypeId)
        }
    }

    const toPrevStep = (): void => {
        if (stage === 'book') setStage('newRepairs')
        if (stage === 'newRepairs') setStage('book')
    }

    return (
        <div>
            <Head>
                <title>New Repair</title>
                <meta name="description" content="Begin New Repair" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid grid-cols-3 grid-rows-1 min-h-screen pb-16 ml-16 mr-16">
                <If condition={stage !== 'book'}>
                    <button
                        className="col-span-1 mx-auto place-self-start"
                        onClick={() => toPrevStep()}
                    >&lt; Back</button>
                </If>

                <div className="col-start-2">
                    <If condition={stage === 'book'}>
                        <div className="font-sans text-slate-50 text-3xl text-center drop-shadow-lg pb-10">
                            Begin by Adding A New Book
                        </div>
                        <div className="m-auto">
                            <form
                                autoComplete="off"
                                onSubmit={(event) => submitBookData(event)}
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
                                    onChange={(value) => setBindingType(value)}
                                    input={ bindingType }
                                    inputId={ "Binding Type" }
                                    options={ bindingTypeOptions }
                                    displayKey={ "display"}
                                    storeKey={ "store" }
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
                                    requiredInputs={ [title, author, bindingType, received, ownerId] }
                                    requiredDates={ [receivedValid] }
                                    dateValids={ [receivedValid, returnedValid] }
                                    text="Save Book and Continue"
                                />

                                <FormCancelButton
                                    clearInvalids={() => clearErrors()}
                                    cancelClick={() => cancelBookInputs()}
                                />
                            </form>
                        </div>
                    </If>
                    <If condition={stage === 'newRepairs'}>
                        <div className="font-sans text-slate-50 text-3xl text-center drop-shadow-lg pb-10">
                            Create Your Repairs
                        </div>
                        <div className="m-auto">
                            {repairForms.map((input, index) => (
                                <form
                                    className="mb-16"
                                    id="repairForm"
                                    autoComplete="off"
                                    onSubmit={(event) => submitNewRepairsData(event)}
                                    key={ index }
                                >
                                    <div>
                                        <FormSelectInput
                                            onChange={(value) => updateRepairTypeInputs(value, index)}
                                            input={ input }
                                            inputId={ "Repair Type" }
                                            options={ repairTypes }
                                            displayKey={ "repairTypeName"}
                                            storeKey={ "id" }
                                            required={ true }
                                        />
                                    </div>

                                    {/* Spine Replacement Form */}
                                    <If condition={repairForms[index] === '0252d235-e96c-42c4-b06d-c8278f9ee51a'}>
                                        <FormTextInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["textBlockHeight"]: value })}
                                            placeholder={ "'8'" }
                                            input={ repairSpecs.textBlockHeight }
                                            inputId={ "Text Block Height" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />

                                        <FormTextInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineWidth"]: value })}
                                            placeholder={ "'2'" }
                                            input={ repairSpecs.spineWidth }
                                            inputId={ "Spine Width" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineMaterial"]: value })}
                                            input={ repairSpecs.spineMaterial }
                                            inputId={ "Spine Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineLiningMaterial"]: value })}
                                            input={ repairSpecs.spineLiningMaterial }
                                            inputId={ "Spine Lining Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["caseLiningMaterial"]: value })}
                                            input={ repairSpecs.caseLiningMaterial }
                                            inputId={ "Case Lining Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookRibbonMaterial"]: value })}
                                            input={ repairSpecs.bookRibbonMaterial }
                                            inputId={ "Book Ribbon" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>

                                    {/* Cover Replacement Form */}
                                    <If condition={repairForms[index] === '9135b9d4-f631-4734-a334-b2b2f944639a'}>
                                        <FormTextInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["textBlockHeight"]: value })}
                                            placeholder={ "'8'" }
                                            input={ repairSpecs.textBlockHeight }
                                            inputId={ "Text Block Height" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />

                                        <FormTextInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineWidth"]: value })}
                                            placeholder={ "'2'" }
                                            input={ repairSpecs.spineWidth }
                                            inputId={ "Spine Width" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["coverType"]: value })}
                                            input={ repairSpecs.coverType }
                                            inputId={ "Cover Type" }
                                            options={ coverTypeOptions }
                                            displayKey={ "display"}
                                            storeKey={ "store" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineMaterial"]: value })}
                                            input={ repairSpecs.spineMaterial }
                                            inputId={ "Spine Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["sideMaterial"]: value })}
                                            input={ repairSpecs.sideMaterial }
                                            inputId={ "Side Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookBoardMaterial"]: value })}
                                            input={ repairSpecs.bookBoardMaterial }
                                            inputId={ "Book Board Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineLiningMaterial"]: value })}
                                            input={ repairSpecs.spineLiningMaterial }
                                            inputId={ "Spine Lining Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["caseLiningMaterial"]: value })}
                                            input={ repairSpecs.caseLiningMaterial }
                                            inputId={ "Case Lining Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["flysheetMaterial"]: value })}
                                            input={ repairSpecs.flysheetMaterial }
                                            inputId={ "Flysheet Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["japanesePaperMaterial"]: value })}
                                            input={ repairSpecs.japanesePaperMaterial }
                                            inputId={ "Japanese Paper" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["cheeseclothMaterial"]: value })}
                                            input={ repairSpecs.cheeseclothMaterial }
                                            inputId={ "Cheesecloth" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookRibbonMaterial"]: value })}
                                            input={ repairSpecs.bookRibbonMaterial }
                                            inputId={ "Book Ribbon" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue Material" }
                                            options={ getMaterialsList(repairForms[index]) }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>

                                    <FormCancelButton
                                        clearInvalids={() => clearErrors()}
                                        cancelClick={() => cancelRepairForm(index)}
                                        value="Cancel Repair"
                                    />
                                </form>
                            ))}

                            <button
                                    className="block mx-auto mt-16"
                                    onClick={() => addRepairForm()}
                                    type="button"
                                    value="Add Another Repair"
                            >
                                Add Another Repair
                            </button>
                            
                            <button
                                className="block mx-auto mt-8"
                            >
                                Finish
                            </button>
                        </div>
                    </If>
                </div>

                <div className="cols-span-1"></div>
            </div>
        </div>
    )
}

export default NewRepair