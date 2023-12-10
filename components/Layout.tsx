import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}) {

    const [isDark, setIsDark] = useState(true)
    const [themeName, setThemeName] = useState("")

    useEffect(() => {
        setIsDark(JSON.parse(localStorage.getItem("isDark")))
        if (isDark === true) {
            setThemeName("dim")
        }
        else {
            setThemeName("fantasy")
        }
        console.log("i" + JSON.parse(localStorage.getItem("isDark")))
        console.log(themeName)
      }, [])

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("isDark")) !== null) {
            localStorage.setItem('isDark', JSON.stringify(isDark));
        }
        if (isDark === true) {
            setThemeName("dim")
        }
        else {
            setThemeName("fantasy")
        }
        console.log("k" + JSON.parse(localStorage.getItem("isDark")))
        console.log(themeName)
      }, [isDark])

    return  (
        <div data-theme={themeName}>
            <Navbar 
                setTheme={setIsDark}
                isDark={isDark}
            />
            <Sidebar/>
			<div className="fixed h-full bg-gray-600 w-1 ml-80"></div>
            <div className="pl-80 pt-24 min-h-screen">
                {children}
            </div>
            
        </div>
    )
}