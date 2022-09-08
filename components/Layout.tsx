import Navbar from './Navbar'

export default function Layout({children}) {
    return  (
        <div>
            <Navbar/>
			<div className="fixed h-full bg-gray-600 w-1 ml-80"></div>
            <div className="bg-gray-900 pl-96 pt-24 min-h-screen">
                {children}
            </div>
            
        </div>
    )
}