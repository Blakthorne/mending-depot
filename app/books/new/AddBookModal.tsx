export default function AddBookModal({ redirectToNewRepair }) {
    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-center text-lg">It's Submitted!</h3>
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
    )
}