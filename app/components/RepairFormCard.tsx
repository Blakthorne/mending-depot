export default function RepairFormCard(props) {

    /**
     * Calls both the {@link clearInvalids} and {@link cancelClick} passed by the parent component
     */
    const onClick = (): void => {
        props.clearInvalids()
        props.cancelClick()
    }

    return (
        <div className="card bg-base-300 shadow-md mb-16">
            <div className="card-body">
                <div className="flex mb-8">
                    <h2 className="card-title grow">{ props.title }</h2>
                    <div className="card-actions">
                        <button
                            className="btn btn-square btn-sm"
                            onClick={() => onClick()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}