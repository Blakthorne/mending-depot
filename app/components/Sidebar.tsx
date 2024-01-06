import Link from 'next/link';

export default function Sidebar() {
    return (
		<ul className="menu p-4 w-80 min-h-full bg-base-200">
			<li>
				<h2 className="menu-title">Books</h2>
				<ul>
					<li><Link href="/books/new">Add Book</Link></li>
					<li><Link href="/books">List</Link></li>
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
	)
}