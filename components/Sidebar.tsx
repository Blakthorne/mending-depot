import Link from 'next/link';

export default function Sidebar() {
    return (
		<div className="fixed w-80 h-full left-0 overflow-y-auto">
			<ul className="menu menu-md bg-base-200">
				<li><Link href="/new-repair">Start New Repair</Link></li>
				<li>
					<h2 className="menu-title">Books</h2>
					<ul>
						<li><Link href="/books">Add Book</Link></li>
						<li><Link href="/books">Mark Complete</Link></li>
						<li><Link href="/books">Edit Existing</Link></li>
					</ul>
				</li>
				<li>
					<h2 className="menu-title">Materials</h2>
					<ul>
						<li><Link href="/materials">Add Material</Link></li>
						<li><Link href="/material-types">Add Material Type</Link></li>
						<li><Link href="/type-for-material">View List with Types</Link></li>
					</ul>
				</li>
				<li>
					<h2 className="menu-title">Inventory</h2>
					<ul>
						<li><Link href="/inventory-transactions">Transactions</Link></li>
					</ul>
				</li>
				<li>
					<h2 className="menu-title">Types</h2>
					<ul>
						<li><Link href="/repair-types">Repairs</Link></li>
						<li><Link href="/binding-types">Bindings</Link></li>
						<li><Link href="/unit-types">Units</Link></li>
					</ul>
				</li>
				<li><Link href="/owners">Owners</Link></li>
				<li><Link href="/manufacturers">Manufacturers</Link></li>
				<li><Link href="/providers">Providers</Link></li>
			</ul>
		</div>
	)
}