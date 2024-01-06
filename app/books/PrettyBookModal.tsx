import Link from 'next/link';

export default function PrettyBookModal({ curBookTitle, curBookId }: { curBookTitle: string, curBookId: string }) {
    return (
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-center text-lg">You've selected '{curBookTitle}'</h3>
                <div className="flex gap-x-8 justify-center mt-8 mb-4">
                    <Link
                        className="btn btn-outline"
                        href={"/books/summary/" + curBookId}>Summary
                    </Link>
                    <Link
                        className="btn btn-outline"
                        href={"/books/edit/" + curBookId}>Edit
                    </Link>
                    <Link
                        className="btn btn-outline"
                        href={"/books/repairs/" + curBookId}>Add Repairs
                    </Link>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}