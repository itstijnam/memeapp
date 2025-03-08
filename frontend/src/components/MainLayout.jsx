import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar.jsx'

function MainLayout() {
  return (
    <div>
        <LeftSideBar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout