import Link from 'next/link';

export default function Navbar() {
    return (
		<div className="bg-slate-800 sticky top-0">
			<div className="container mx-auto flex p-7 flex-row items-center">
				<div className="mr-auto font-semibold text-4xl text-slate-100">
					<Link href="/">Mending Depot</Link>
				</div>
				<div>
					<div className="inline-flex items-center text-2xl text-slate-400">
						<Link href="/the-depot" className="mr-5 hover:text-slate-100">The Depot</Link>
					</div>
				</div>
			</div>
		</div>
	)
}