import useSWR, { useSWRConfig } from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import FormTextInput from '../components/FormTextInput'
import FormSelectInput from '../components/FormSelectInput'
import FormSubmitButton from '../components/FormSubmitButton'
import FormCancelButton from '../components/FormCancelButton'

type TypeForMaterial = {
    materialTypeName: string;
    materialTypeId: string;
    materialName: string;
    materialId: string;
}

type RepairSpecsType = {
    [key: string]: string;
}

type submitRepairsType = {
    bookBody: Book;
    repairForms: RepairType[];
    repairSpecs: RepairSpecsType;
}

function If(props) {
    return props.condition ? <>{props.children}</> : null;
}

function NewRepair() {

    // Create state for stage of the new repair process
    const [stage, setStage] = useState('book')

    // Create state for the attributes of a book
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [publisher, setPublisher] = useState('')
    const [yearPublished, setYearPublished] = useState('')
    const [numberOfPages, setNumberOfPages] = useState('')
    const [bindingTypeId, setBindingTypeId] = useState(undefined)
    const [received, setReceived] = useState('')
    const [ownerId, setOwnerId] = useState('')

    // Changed in the FormTextInput component where the constraint "date" is provided
    // and passed via function through the optional parameter isDateValid
    const [receivedValid, setReceivedValid] = useState(false)
    const [returnedValid, setReturnedValid] = useState(false)

    // Create an empty RepairType form entry to be used as a placeholder
    const blankRepairForm: RepairType = {
        id: '',
        repairTypeName: ''
    }

    // Create state for the repair type form inputs
    const [repairForms, setRepairForms] = useState([blankRepairForm])

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

    // For redirecting to summary page upon entry completion
    const router = useRouter()

    // Retrieve the owners table to get the owner names and ids to be used as the foreign key in the book table
    const { data: owners, error } = useSWR<Owner[], Error>('/api/owners', fetcher)
    if (error) console.log(error)

    // Retrieve the repairtypes table to get the repair type names and ids to be used as the foreign key in the repairs table
    const { data: repairTypes, error: repairTypesError } = useSWR<RepairType[], Error>('/api/repairtypes', fetcher)
    if (repairTypesError) console.log(repairTypesError)

    // Retrieve the type for materials pairs table to get the material type and material names for material selection
    const { data: materials, error: materialsError } = useSWR<object[], Error>('/api/typesformaterials/pairs', fetcher)
    if (materialsError) console.log(materialsError)

    // Retrieve the binding types
    const { data: bindingTypeIds, error: bindingTypeIdsError } = useSWR<object[], Error>('/api/bindingtypes', fetcher)
    if (bindingTypeIdsError) console.log(bindingTypeIdsError)

    // Create array of the cover type options to be used in the Cover Replacement form
    let coverTypeOptions: object[] =  [{"display": "Full Bound", "store": "fullBound"}, {"display": "Quarter Bound", "store": "quarterBound"}, {"display": "Three-Quarter Bound", "store": "threeQuarterBound"}]

    /**
     * Submit data to the server upon pressing the submit button in the form
     * 
     * @param {React.FormEvent<HTMLFormElement>} e The event provided when the submit button is pressed
     */
     const submitBookData = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        // Prevent the browser from reloading the whole page
        e.preventDefault()

        setStage('newRepairs')
    }

    /**
     * Submit data to the server upon pressing the submit button in the form
     */
     const submitNewRepairsData = async (): Promise<void>  => {

        // Create an object composed of the info from the new Book form
        const bookBody: Book = { title, author, publisher, yearPublished, numberOfPages, bindingTypeId, received, returned, bookMaterialsCost, amountCharged, ownerId }

        let newBook: Book

        try {
            const body: submitRepairsType = { bookBody, repairForms, repairSpecs }
            await fetch('/api/repairs/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            .then((response) => response.json())
            .then((response) => {
                newBook = response
            });

            cancelBookInputs()
            cancelAllRepairForms()
            clearErrors()

            // Update the UI wherever this API call is referenced
            mutate('/api/books')
            mutate('/api/repairs')

            if (newBook.id !== undefined) {
                router.push('/summary/' + newBook.id)
            }
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
     * Clear the book form inputs
     */
    const cancelBookInputs = (): void => {
        setTitle('')
        setAuthor('')
        setPublisher('')
        setYearPublished('')
        setNumberOfPages('')
        setBindingTypeId('')
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
            setRepairForms([blankRepairForm])
        }
        else {
            let frontForms: RepairType[] = repairForms.slice(0, repairNum)
            let backForms: RepairType[] = repairForms.slice(repairNum + 1, undefined)

            frontForms = [...frontForms, ...backForms]

            setRepairForms(frontForms)
        }
    }

    /**
     * Clear all the repair forms upon submission
     */
    const cancelAllRepairForms = (): void => {
        setRepairForms([blankRepairForm]);
    }

    /**
     * Add another input field for adding another repair associated with the book
     */
     const addRepairForm = (): void => {
        setRepairForms(repairForms => [...repairForms, blankRepairForm])
    }

    /**
     * Update the repairTypesInputs state with new information selected by the user
     */
     const updateRepairTypeInputs = (input: string, index: number): void => {
        
        // Use the ellipses syntax to copy the array and tell React that the state reference has changed
        let curRepairsArray = [...repairForms]

        const hasReparTypeId = (item: RepairType) => item.id === input

        const curRepairTypeIndex: number = repairTypes.findIndex(hasReparTypeId)

        curRepairsArray[index] = repairTypes[curRepairTypeIndex]

        setRepairForms(curRepairsArray)
    }

    /**
     * Create a list containing only materials for the given material type
     */
    const getMaterialsList = (materialTypeName: string): object[] => {
        if (materials) {
            return materials.filter((material: TypeForMaterial) => material.materialTypeName === materialTypeName)
        }
    }

    const toPrevStep = (): void => {
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
                                    onChange={(value) => setBindingTypeId(value)}
                                    input={ bindingTypeId }
                                    inputId={ "Binding Type" }
                                    options={ bindingTypeIds }
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
                                    text="Start Adding Repairs"
                                    id='bookSubmitButton'
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
                                    key={ index }
                                >
                                    <div>
                                        <FormSelectInput
                                            onChange={(value) => updateRepairTypeInputs(value, index)}
                                            input={ input.id }
                                            inputId={ "Repair Type" }
                                            options={ repairTypes }
                                            displayKey={ "repairTypeName"}
                                            storeKey={ "id" }
                                            required={ true }
                                        />
                                    </div>

                                    {/* Spine Replacement Form */}
                                    <If condition={repairForms[index].repairTypeName === "Spine Replacement"}>
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
                                            options={ getMaterialsList("Cover Material") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineLiningMaterial"]: value })}
                                            input={ repairSpecs.spineLiningMaterial }
                                            inputId={ "Spine Lining" }
                                            options={ getMaterialsList("Spine Lining") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["caseLiningMaterial"]: value })}
                                            input={ repairSpecs.caseLiningMaterial }
                                            inputId={ "Case Lining" }
                                            options={ getMaterialsList("Case Lining") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookRibbonMaterial"]: value })}
                                            input={ repairSpecs.bookRibbonMaterial }
                                            inputId={ "Book Ribbon" }
                                            options={ getMaterialsList("Book Ribbon") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue" }
                                            options={ getMaterialsList("Glue") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>

                                    {/* Cover Replacement Form */}
                                    <If condition={repairForms[index].repairTypeName === "Cover Replacement"}>
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
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["textBlockWidth"]: value })}
                                            placeholder={ "'5'" }
                                            input={ repairSpecs.textBlockWidth }
                                            inputId={ "Text Block Width" }
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

                                        {repairSpecs.coverType === "fullBound" ? '' : <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineMaterial"]: value })}
                                            input={ repairSpecs.spineMaterial }
                                            inputId={ "Spine Material" }
                                            options={ getMaterialsList("Cover Material") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ repairSpecs.coverType === "fullBound" ? false : true }
                                        />}

                                        <FormSelectInput
                                            onChange={(value) => {repairSpecs.coverType === "fullBound" ? setRepairSpecs({ ...repairSpecs, ["sideMaterial"]: value, ["spineMaterial"]: value}) : setRepairSpecs({ ...repairSpecs, ["sideMaterial"]: value })}}
                                            input={ repairSpecs.sideMaterial }
                                            inputId={ repairSpecs.coverType === "fullBound" ? "Cover Material" : "Side Material"}
                                            options={ getMaterialsList("Cover Material") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        {repairSpecs.coverType === "threeQuarterBound" ? <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["cornerMaterial"]: value })}
                                            input={ repairSpecs.cornerMaterial }
                                            inputId={ "Corner Material" }
                                            options={ getMaterialsList("Cover Material") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ repairSpecs.coverType === "threeQuarterBound" ? true : false }
                                        /> : ''}

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookBoardMaterial"]: value })}
                                            input={ repairSpecs.bookBoardMaterial }
                                            inputId={ "Book Board" }
                                            options={ getMaterialsList("Book Board") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineLiningMaterial"]: value })}
                                            input={ repairSpecs.spineLiningMaterial }
                                            inputId={ "Spine Lining" }
                                            options={ getMaterialsList("Spine Lining") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["caseLiningMaterial"]: value })}
                                            input={ repairSpecs.caseLiningMaterial }
                                            inputId={ "Case Lining" }
                                            options={ getMaterialsList("Case Lining") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["flysheetMaterial"]: value })}
                                            input={ repairSpecs.flysheetMaterial }
                                            inputId={ "Flysheet" }
                                            options={ getMaterialsList("Flysheet") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["japanesePaperMaterial"]: value })}
                                            input={ repairSpecs.japanesePaperMaterial }
                                            inputId={ "Japanese Paper" }
                                            options={ getMaterialsList("Japanese Paper") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["cheeseclothMaterial"]: value })}
                                            input={ repairSpecs.cheeseclothMaterial }
                                            inputId={ "Cheesecloth" }
                                            options={ getMaterialsList("Cheesecloth") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookRibbonMaterial"]: value })}
                                            input={ repairSpecs.bookRibbonMaterial }
                                            inputId={ "Book Ribbon" }
                                            options={ getMaterialsList("Book Ribbon") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue" }
                                            options={ getMaterialsList("Glue") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>

                                    {/* Flysheet Replacement Form */}
                                    <If condition={repairForms[index].repairTypeName === "Flysheet Replacement"}>
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
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["textBlockWidth"]: value })}
                                            placeholder={ "'5'" }
                                            input={ repairSpecs.textBlockWidth }
                                            inputId={ "Text Block Width" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />

                                        <FormTextInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineWidth"]: value })}
                                            placeholder={ "'1.5'" }
                                            input={ repairSpecs.spineWidth }
                                            inputId={ "Spine Width" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["spineLiningMaterial"]: value })}
                                            input={ repairSpecs.spineLiningMaterial }
                                            inputId={ "Spine Lining" }
                                            options={ getMaterialsList("Spine Lining") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["caseLiningMaterial"]: value })}
                                            input={ repairSpecs.caseLiningMaterial }
                                            inputId={ "Case Lining" }
                                            options={ getMaterialsList("Case Lining") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["flysheetMaterial"]: value })}
                                            input={ repairSpecs.flysheetMaterial }
                                            inputId={ "Flysheet" }
                                            options={ getMaterialsList("Flysheet") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["japanesePaperMaterial"]: value })}
                                            input={ repairSpecs.japanesePaperMaterial }
                                            inputId={ "Japanese Paper" }
                                            options={ getMaterialsList("Japanese Paper") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["cheeseclothMaterial"]: value })}
                                            input={ repairSpecs.cheeseclothMaterial }
                                            inputId={ "Cheesecloth" }
                                            options={ getMaterialsList("Cheesecloth") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["bookRibbonMaterial"]: value })}
                                            input={ repairSpecs.bookRibbonMaterial }
                                            inputId={ "Book Ribbon" }
                                            options={ getMaterialsList("Book Ribbon") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue" }
                                            options={ getMaterialsList("Glue") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>
                                    
                                    {/* Base Hinge Tightening Form */}
                                    <If condition={repairForms[index].repairTypeName === "Base Hinge Tightening"}>
                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue" }
                                            options={ getMaterialsList("Glue") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>

                                    {/* Tip-In Form */}
                                    <If condition={repairForms[index].repairTypeName === "Tip-In"}>
                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                                            input={ repairSpecs.glueMaterial }
                                            inputId={ "Glue" }
                                            options={ getMaterialsList("Glue") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />
                                    </If>

                                    {/* Paper Repair Form */}
                                    <If condition={repairForms[index].repairTypeName === "Paper Repair"}>
                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["archivalTapeMaterial"]: value })}
                                            input={ repairSpecs.archivalTapeMaterial }
                                            inputId={ "Archival Tape" }
                                            options={ getMaterialsList("Archival Tape") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

                                        <FormTextInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["tapeLength"]: value })}
                                            placeholder={ "'3'" }
                                            input={ repairSpecs.tapeLength }
                                            inputId={ "Approximate Tape Amount (cm)" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />
                                    </If>

                                    {/* Resewing Form */}
                                    <If condition={repairForms[index].repairTypeName === "Resewing"}>
                                        <FormSelectInput
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["threadMaterial"]: value })}
                                            input={ repairSpecs.threadMaterial }
                                            inputId={ "Thread" }
                                            options={ getMaterialsList("Thread") }
                                            displayKey={ "materialName"}
                                            storeKey={ "materialId" }
                                            required={ true }
                                        />

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
                                            onChange={(value) => setRepairSpecs({ ...repairSpecs, ["numberOfSignatures"]: value })}
                                            placeholder={ "'14'" }
                                            input={ repairSpecs.numberOfSignatures }
                                            inputId={ "Number of Signatures" }
                                            constraints={ ["decimal"] }
                                            errorMessage={ "Please only enter a decimal value here." }
                                            required={ true }
                                        />
                                    </If>

                                    <FormCancelButton
                                        clearInvalids={() => clearErrors()}
                                        cancelClick={() => cancelRepairForm(index)}
                                        value="Cancel Repair"
                                        isAdjacent={ true }
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
                                onClick={() => submitNewRepairsData()}
                                    type="button"
                                    value="Finish"
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