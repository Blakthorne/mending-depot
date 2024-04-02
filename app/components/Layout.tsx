'use client'
import { SWRConfig } from 'swr';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({children}) {
    return  (
        <div data-theme
             className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <Navbar/>
                <div className="pt-16 min-h-screen">
                    <SWRConfig
                        value = {{
                            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
                        }}
                    >
                        {children}
                    </SWRConfig>
                </div>
            </div>
            <div className="drawer-side z-20">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <Sidebar/>
            </div>
        </div>
    )
}