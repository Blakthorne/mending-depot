import Link from 'next/link';

export default function Navbar() {
    return (
		<div className="fixed bg-gray-800 w-80 h-full left-0">
			<div className="flex flex-col mx-auto pt-5">
				<div className="mx-auto font-semibold text-4xl mb-16 text-gray-100">
					<Link href="/">Mending Depot</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/new-repair">
						<a className="hover:text-gray-100">
							Start New Repair
						</a>
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/repairs">
						<a className="hover:text-gray-100">
							Repairs
						</a>
					</Link>
					<Link href="/replacement-covers">
						<a className="hover:text-gray-100">
							Replacement Covers
						</a>
					</Link>
					<Link href="/material-for-repair">
						<a className="hover:text-gray-100">
							Material For Repairs
						</a>
					</Link>
					<Link href="/inventory-transactions">
						<a className="hover:text-gray-100">
							Inventory Transactions
						</a>
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/owners">
						<a className="hover:text-gray-100">
							Owners
						</a>
					</Link>
					<Link href="/manufacturers">
						<a className="hover:text-gray-100">
							Manufacturers
						</a>
					</Link>
					<Link href="/providers">
						<a className="hover:text-gray-100">
							Providers
						</a>
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/books">
						<a className="hover:text-gray-100">
							Books
						</a>
					</Link>
					<Link href="/materials">
						<a className="hover:text-gray-100">
							Materials
						</a>
					</Link>
					<Link href="/repair-types">
						<a className="hover:text-gray-100">
							Repair Types
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}