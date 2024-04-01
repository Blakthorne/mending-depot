import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar({ setTheme, isDark }) {
    return (
        <div className="navbar sticky top-0 bg-base-100/90 border-b-2 border-base-300 backdrop-blur-md z-10">
            <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
            </div>
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">Mending Depot</Link>
            </div>
            <div className="flex-none">
                <label className="flex cursor-pointer gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={isDark}
                        onChange={() => setTheme(!isDark)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </label>
                <button className="btn"
                        onClick={() => signIn()}
                >
                    Sign In
                </button>
                <button className="btn"
                        onClick={() => signOut()}
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}