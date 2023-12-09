import React, { useState, useEffect } from 'react';
import { themeChange } from 'theme-change';
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}) {

    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // false parameter is required for react project
        themeChange(false)
      }, [])

      useEffect(() => {
        setIsDark(JSON.parse(localStorage.getItem("data-theme")) === "dim" ? true : false)
      })

    return  (
        <div data-theme=''>
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