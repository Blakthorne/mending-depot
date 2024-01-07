'use client'
import useSWR, { useSWRConfig } from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FormTextInput from '../../../components/forms/FormTextInput'
import FormSelectInput from '../../../components/forms/FormSelectInput'
import RepairFormCard from '../../../components/RepairFormCard'
import LoadingIcon from '../../../loading'

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
    bookId: string;
    repairForms: RepairType[];
    repairSpecs: RepairSpecsType;
}

function If(props) {
    return props.condition ? <>{props.children}</> : null;
}

export default function AddRepairs({ bookId }: {  bookId: string }) {

    // The currently selected repair type id that is set to be added upon add button clicked
    const [curSelectedRepairTypeId, setCurSelectedRepairTypeId] = useState('')
    const [addShouldBeDisabled, setAddShouldBeDisabled] = useState(true)

    // Create an empty RepairType form entry to be used as a placeholder
    const blankRepairForm: RepairType = {
        id: '',
        repairTypeName: ''
    }

    // Create state for the repair type form inputs
    const [repairForms, setRepairForms] = useState([blankRepairForm])

    const tempObj: RepairSpecsType = {}

    const [repairSpecs, setRepairSpecs] = useState(tempObj)

    // For updating the UI on changes to specified API calls
    const { mutate } = useSWRConfig()

    // For redirecting to summary page upon entry completion
    const router = useRouter()

    // Retrieve the repairtypes table to get the repair type names and ids to be used as the foreign key in the repairs table
    const { data: repairTypes, error: repairTypesError } = useSWR<RepairType[], Error>('/api/repairtypes')
    if (repairTypesError) console.log(repairTypesError)

    // Retrieve the type for materials pairs table to get the material type and material names for material selection
    const { data: materials, error: materialsError } = useSWR<object[], Error>('/api/typesformaterials/pairs')
    if (materialsError) console.log(materialsError)

    const { data: book, error: bookError } = useSWR<Book, Error>('/api/books/' + bookId,)
    if (bookError) console.log(bookError)
    if (!book) {
        return (
            <LoadingIcon/>
        )
    }

    // Create array of the cover type options to be used in the Cover Replacement form
    let coverTypeOptions: object[] =  [{"display": "Full Bound", "store": "fullBound"}, {"display": "Quarter Bound", "store": "quarterBound"}, {"display": "Three-Quarter Bound", "store": "threeQuarterBound"}]

    /**
     * Submit data to the server upon pressing the submit button in the form
     */
     const submitNewRepairsData = async (): Promise<void>  => {
        try {
            const body: submitRepairsType = { bookId, repairForms, repairSpecs }
            await fetch('/api/repairs/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            cancelAllRepairForms()
            clearErrors()

            mutate('/api/repairs')
            mutate('/books/summary/' + bookId)
            
            await fetch('/books/summary/revalidate/' + bookId)
            router.push("/books/summary/" + bookId)
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
     * Update the repairTypesInputs state with new information selected by the user
     */
     const updateRepairTypeInputs = (input: string): void => {
        
        // Use the ellipses syntax to copy the array and tell React that the state reference has changed
        let curRepairsArray = [...repairForms]

        // Get the name of the repair type associated with the repair type id
        const hasRepairTypeId = (item: RepairType) => item.id === input

        const curRepairTypeIndex: number = repairTypes.findIndex(hasRepairTypeId)

        // If there is only the default blank repairForm in the array, just set the first element;
        // If the first element is already set, then push the new repair to the beginning of the list.
        if (repairForms[0].id === '' && repairForms[0].repairTypeName === '') {
            curRepairsArray[0] = repairTypes[curRepairTypeIndex]
        }
        else {
            curRepairsArray.unshift(repairTypes[curRepairTypeIndex])
        }

        setRepairForms(curRepairsArray)

        // Reset user selection
        setCurSelectedRepairTypeId('')

        // Disable add button since selection has been cleared
        setAddShouldBeDisabled(true)
    }

    /**
     * Create a list containing only materials for the given material type
     */
    const getMaterialsList = (materialTypeName: string): object[] => {
        if (materials) {
            return materials.filter((material: TypeForMaterial) => material.materialTypeName === materialTypeName)
        }
    }

    /**
     * Set states for the selected repairType ID and Name that the user has selected
     * @param value The ID of the repairType that the user has selected to add
     */
    const setCurSelectedRepairType = (value: string) => {

        // Set the currently queued up repair type id
        setCurSelectedRepairTypeId(value)

        // Also enable the add button
        setAddShouldBeDisabled(false)
    }

    /**
     * Componenets for new repair selection
     * @returns 
     */
    const selectNewRepairsForm = () => {
        return (
            <div className="join w-full">
                <div className="join-item w-full">
                    <FormSelectInput
                        onChange={(value) => setCurSelectedRepairType(value)}
                        input={ curSelectedRepairTypeId }
                        inputId={ "" }
                        options={ repairTypes }
                        displayKey={ "repairTypeName"}
                        storeKey={ "id" }
                        required={ false }
                    />
                </div>
                <button className="btn btn-neutral disabled:btn-disabled my-2 ml-4"
                        onClick={() => updateRepairTypeInputs(curSelectedRepairTypeId)}
                        disabled={ addShouldBeDisabled }
                >Add Another Repair</button>
            </div>
        )
    }

    /**
     * Componenets for the adding new repairs
     * @returns 
     */
    const addNewRepairsForm = () => {
        return (
            <div>
                {repairForms.map((input, index) => (
                    <If condition={input.id !== ''}
                        key={index + input.id }
                    >
                        <RepairFormCard
                            title={ input.repairTypeName }
                            clearInvalids={() => clearErrors()}
                            cancelClick={() => cancelRepairForm(index)}
                        >
                                {/* Spine Replacement Form */}
                                <If condition={repairForms[index].repairTypeName === "Spine Replacement"}>
                                    {spineReplacementForm()}
                                </If>

                                {/* Cover Replacement Form */}
                                <If condition={repairForms[index].repairTypeName === "Cover Replacement"}>
                                    {coverReplacementForm()}
                                </If>

                                {/* Flysheet Replacement Form */}
                                <If condition={repairForms[index].repairTypeName === "Flysheet Replacement"}>
                                    {flysheetReplacementForm()}
                                </If>
                                
                                {/* Base Hinge Tightening Form */}
                                <If condition={repairForms[index].repairTypeName === "Base Hinge Tightening"}>
                                    {basehingeTighteningReplacementForm()}
                                </If>

                                {/* Tip-In Form */}
                                <If condition={repairForms[index].repairTypeName === "Tip-In"}>
                                    {TipinForm()}
                                </If>

                                {/* Paper Repair Form */}
                                <If condition={repairForms[index].repairTypeName === "Paper Repair"}>
                                    {PaperRepairForm()}
                                </If>

                                {/* Resewing Form */}
                                <If condition={repairForms[index].repairTypeName === "Resewing"}>
                                    {ResewingForm()}
                                </If>
                        </RepairFormCard>
                    </If>
                ))}
            </div>
        )
    }

    /**
     * Componenets for the Spine Replacement Form
     * @returns 
     */
    const spineReplacementForm = () => {
        return (
            <div>
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
            </div>
        )
    }

    /**
     * Componenets for the Cover Replacement Form
     * @returns 
     */
    const coverReplacementForm = () => {
        return (
            <div>
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
            </div>
        )
    }

    /**
     * Componenets for the Flysheet Replacement Form
     * @returns 
     */
    const flysheetReplacementForm = () => {
        return (
            <div>
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
            </div>
        )
    }

    /**
     * Componenets for the Basehinge Tightening Form
     * @returns 
     */
    const basehingeTighteningReplacementForm = () => {
        return (
            <div>
                <FormSelectInput
                    onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                    input={ repairSpecs.glueMaterial }
                    inputId={ "Glue" }
                    options={ getMaterialsList("Glue") }
                    displayKey={ "materialName"}
                    storeKey={ "materialId" }
                    required={ true }
                />
            </div>
        )
    }

    /**
     * Componenets for the Tipin Form
     * @returns 
     */
    const TipinForm = () => {
        return (
            <div>
                <FormSelectInput
                    onChange={(value) => setRepairSpecs({ ...repairSpecs, ["glueMaterial"]: value })}
                    input={ repairSpecs.glueMaterial }
                    inputId={ "Glue" }
                    options={ getMaterialsList("Glue") }
                    displayKey={ "materialName"}
                    storeKey={ "materialId" }
                    required={ true }
                />
            </div>
        )
    }

    /**
     * Componenets for the Paper Repair Form
     * @returns 
     */
    const PaperRepairForm = () => {
        return (
            <div>
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
            </div>
        )
    }

    /**
     * Componenets for the Resewing Form
     * @returns 
     */
    const ResewingForm = () => {
        return (
            <div>
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
            </div>
        )
    }

    return (
        <div>
            <Head>
                <title>Add Repairs to {book.title}</title>
                <meta name="description" content="Add repairs to a book" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col min-h-screen">
                <div className="text-3xl text-center tracking-wide mb-10">
                    Add Repairs to '{book.title}'
                </div>
                <div className="mx-auto">
                    <div>
                        {selectNewRepairsForm()}
                    </div>
                    <div className="flex flex-row justify-center">
                        <button
                            className="btn btn-primary mb-10 w-full"
                            onClick={() => submitNewRepairsData()}
                        >Finish</button>
                    </div>
                    <div className="m-auto">
                        {addNewRepairsForm()}
                    </div>
                </div>
            </div>
        </div>
    )
}