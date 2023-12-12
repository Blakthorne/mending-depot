import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}) {

    // Store a boolean value for whether theme is dark or not
    const [isDark, setIsDark] = useState(true)

    // Store the theme name,
    // Initialize to empty string
    const [themeName, setThemeName] = useState("")

    const determineThemeName = (): void => {
        if (isDark === true) {
            setThemeName("dracula")
        }
        else {
            setThemeName("fantasy")
        }
    }

    // Trigger only on first render of page;
    // I can only perform these operations in a useEffect() since
    // localStorage is only present on the client. I get a JSON error
    // if I try to do it elsewhere
    useEffect(() => {
        
        // Retrieve the isDark boolean from client localStorage
        setIsDark(JSON.parse(localStorage.getItem("isDark")))

        // Set the themeName based on the isDark boolean
        determineThemeName()
      }, [])

    // Trigger when isDark is changed by the user in the Navbar component
    useEffect(() => {

        // Only set the isDark variable in localStorage if it's there already;
        // This prevents it from double setting it on the first render as a side effect
        // of the other useEffect() above
        if (JSON.parse(localStorage.getItem("isDark")) !== null) {
            localStorage.setItem('isDark', JSON.stringify(isDark));
        }

        // Set the themeName based on the isDark boolean
        determineThemeName()
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