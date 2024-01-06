'use client'

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}) {

    // Store a boolean value for whether theme is dark or not
    const [isDark, setIsDark] = useState(true)

    // Store the theme name,
    // Initialize to empty string
    const [themeName, setThemeName] = useState("")

    /**
     * Set the theme name based on the isDark state value
     */
    const determineThemeName = (): void => {
        if (isDark === true) {
            setThemeName("dim")
        }
        else {
            setThemeName("garden")
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
        <div data-theme={themeName} 
             className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <Navbar 
                    setTheme={setIsDark}
                    isDark={isDark}
                />
                <div className="pt-16 min-h-screen">
                    {children}
                </div>
            </div>
            <div className="drawer-side z-20">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <Sidebar/>
            </div>
        </div>
    )
}