import Sidebar from './Sidebar'
import React, { Children } from 'react'
import Navbar from './Navbar'


function Layout({ children , showSidebar=false }) {
  return ( 
  <div className='min-h-screen'>
    <div className="flex">
{showSidebar && <Sidebar/>}

<div className="flex-1 flex flex-col">
<Navbar/>

  <main className="flex-1">
        {children}  
      </main>
</div>

    </div>
      
    </div>
    )
  
}

export default Layout
