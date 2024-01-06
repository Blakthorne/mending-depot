export default function AddBookModal({ redirectToNewRepair, redirectToSummary }) {
    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-center text-lg">It's Submitted!</h3>
                <p className="pt-6">Where would you like to go now?</p>
                <div className="modal-action">
                <form className="flex gap-4"
                        method="dialog">
                    <div className="btn btn-primary"
                         onClick={() => redirectToNewRepair()}>Add Repairs</div>
                    <div className="btn btn-secondary"
                         onClick={() => redirectToSummary()}>Go To Summary</div>
                    <button className="btn btn-info">Add Another Book</button>
                </form>
                </div>
            </div>
        </dialog>
    )
}