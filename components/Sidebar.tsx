import Link from 'next/link';

export default function Sidebar() {
    return (
		<div className="fixed w-80 h-full left-0">
			<div className="flex flex-col mx-auto pt-5">
				<div className="mx-auto font-semibold text-4xl mb-16 text-gray-100">
					<Link href="/">Mending Depot</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/new-repair" className="hover:text-gray-100">
						Start New Repair
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/repairs" className="hover:text-gray-100">
						Repairs
					</Link>
					<Link href="/material-for-repair" className="hover:text-gray-100">
						Material For Repairs
					</Link>
					<Link href="/type-for-material" className="hover:text-gray-100">
						Types For Materials
					</Link>
					<Link href="/inventory-transactions" className="hover:text-gray-100">
						Inventory Transactions
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/books" className="hover:text-gray-100">
						Books
					</Link>
					<Link href="/owners" className="hover:text-gray-100">
						Owners
					</Link>
					<Link href="/manufacturers" className="hover:text-gray-100">
						Manufacturers
					</Link>
					<Link href="/providers" className="hover:text-gray-100">
						Providers
					</Link>
					<Link href="/materials" className="hover:text-gray-100">
						Materials
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-2xl pl-10 text-gray-400 mb-16">
					<Link href="/material-types" className="hover:text-gray-100">
						Material Types
					</Link>
					<Link href="/repair-types" className="hover:text-gray-100">
						Repair Types
					</Link>
					<Link href="/binding-types" className="hover:text-gray-100">
						Binding Types
					</Link>
					<Link href="/unit-types" className="hover:text-gray-100">
						Unit Types
					</Link>
				</div>
			</div>
		</div>
	)
}