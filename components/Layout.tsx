import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}) {
    
    let isDarkBool: boolean = false
    const [themeName, setThemeName] = useState('')

    // Only access local storage if on the client
    if (typeof window !== 'undefined') {
        
        // Allow an empty string to be accepted if the localStorage item hasn't been created yet
        isDarkBool = JSON.parse(localStorage.getItem('isDark') ?? '{}')
    }

    // Store theme in localStorage to persist theme on page refresh
    const [isDark, setIsDark] = useState(() => {
        typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('isDark')) ?? '{}' : "fantasy"
    })
    
    useEffect(() => {
        localStorage.setItem('isDark', JSON.stringify(isDark))
        setTheme()
    }, [isDark])

    const setTheme = () => {
        if (themeName !== "dim") {
            setThemeName("dim")
        }
        else {
            setThemeName("fantasy")
        }
    }

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