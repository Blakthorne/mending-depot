import Link from 'next/link';

export default function Navbar() {
    return (
		<div className="bg-slate-800/90 sticky top-0 z-10 shadow-xl shadow-slate-700">
			<div className="container mx-auto flex p-7 flex-row items-center">
				<div className="mr-auto font-semibold text-4xl text-slate-100">
					<Link href="/">Mending Depot</Link>
				</div>
				<div>
					<div className="inline-flex text-2xl text-slate-400">
						<Link href="/the-depot">
							<a className="mr-5 hover:text-slate-100">
								The Depot
							</a>
						</Link>
                        <Link href="/new-mend">
							<a className="hover:text-slate-100">
								New Mend
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}