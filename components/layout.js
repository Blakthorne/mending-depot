import Navbar from '../components/navbar'

export default function Layout({children}) {
    return <div className="flex flex-col min-h-screen bg-slate-500">
        <Navbar/>
        {children}
    </div>
}